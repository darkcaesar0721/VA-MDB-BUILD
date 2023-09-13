const express = require('express');
const router = express.Router();
const ODBC = require("odbc");

const Groups = require('../models/group.model');
const Campaigns = require('../models/campaign.model');

const whatsappLibrary = require('../libraries/whatsapp');
const uploadLibrary = require('../libraries/upload');
const Settings = require("../models/setting.model");
const moment = require("moment");

router.post('/', async (req, res) => {
    const {groupId, campaignId, manually} = req.body;
    await uploadLibrary.uploadSheet(groupId, campaignId, manually, function(result){res.json(result);});
});

router.post('/upload_preview', async (req, res) => {
    const {groupId, campaignId, manually} = req.body;
    await uploadLibrary.uploadPreviewSheet(groupId, campaignId, function(result){res.json(result);});
});

router.get('/get_last_phone', (req, res) => {
    const mdb_path = req.query.mdb_path;
    const id = req.query.campaignId;

    Campaigns.findOne({_id: id}, (err, campaign) => {
        Settings.findOne({}, (err, setting) => {
            const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)}; DBQ=${setting.mdb_path}; Uid=;Pwd=;`;

            ODBC.connect(connectionString, (error, connection) => {
                if (error) {
                    res.json({status: 'error', description: "Please can't connect to this MDB file.", campaign:{}});
                    return;
                }

                connection.query(`SELECT TOP 1 * FROM [${campaign.query}]`, async (error, result) => {
                    await connection.close();

                    if (error) {
                        res.json({status: 'error', description: "Please can't run this mdb query.", campaign: {}});
                        return;
                    } else {
                        if (result.length === 0) {
                            res.json({status: 'error', description: "mdb not data", campaign: {}});
                            return;
                        }
                        const obj = {};
                        obj.last_phone = result[0].Phone;
                        obj.system_create_datetime = result[0].SystemCreateDate;
                        obj.is_get_last_phone = true;

                        Campaigns.findByIdAndUpdate(id, obj, (err, updatedCampaign) => {
                            Campaigns.findOne({_id: id}, (err, campaign) => {
                                res.json({status: 'success', campaign: campaign});
                            });
                        });
                    }
                });
            });
        })
    })
});

router.post('/get_last_input_date', async (req, res) => {
    await uploadLibrary.getLastInputDate(function(result) {
        if (result.status === "error") {
            res.json(result);
        } else {
            Groups.updateOne({_id: req.body.groupId}, {last_control_date: req.body.currentDate, last_input_date: result.date}, function(err, doc) {
                res.json(result);
            });
        }
    });
});

router.post('/update_is_manually', async  (req, res) => {
    const campaignIds = req.body.campaignIds;
    const update = function(index, callback) {
        if ((index + 1) === campaignIds.length) {
            callback();
            return;
        }

        const campaignId = campaignIds[index];
        Groups.updateOne({_id: req.body.groupId, "campaigns._id": campaignId}, {"campaigns.$.is_manually_upload": req.body.value}, (err, doc) => {
            update(index + 1, callback);
        });
    };
    update(0, function() {
        res.json("success");
    });
});

router.post('/stop_campaign_running', async  (req, res) => {
    const groupId = req.body.groupId;
    const campaignId = req.body.campaignId;
    Groups.updateOne({_id: groupId, "campaigns.is_stop_running_status": true}, {"campaigns.$.is_stop_running_status": false}, (err, doc) => {
        Groups.updateOne({_id: req.body.groupId, "campaigns._id": campaignId}, {"campaigns.$.is_stop_running_status": true}, (err, doc) => {
            res.json("success");
        });
    });
});

module.exports = router;