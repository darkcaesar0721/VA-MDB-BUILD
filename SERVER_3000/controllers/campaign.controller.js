const express = require('express');
const router = express.Router();
const ODBC = require('odbc');

const Campaigns = require('../models/campaign.model');
const Settings = require('../models/setting.model');
const Groups = require("../models/group.model");

router.get('/', (req, res) => {
    Campaigns.find({}, (err, campaigns) => {
        res.json(campaigns);
    })
});

router.post('/', (req, res) => {
    Campaigns.create(req.body, (err, newCampaign) => {
        res.json(newCampaign);
    })
});

router.put('/:id', (req, res) => {
    Campaigns.findByIdAndUpdate(req.params.id, req.body, (err, updatedCampaign) => {
        Campaigns.findOne({_id: req.params.id}, (err, campaign) => {
            res.json(campaign); //.json() will send proper headers in response so client knows it's json coming back
        });
    });
});

router.delete('/:id', (req, res) => {
    Campaigns.findByIdAndRemove(req.params.id, (err, removedCampaign) => {
        Groups.updateMany({ "campaigns.detail":  req.params.id}, {
            $pull: {
                campaigns: {detail: req.params.id},
            },
        }, (err, doc) => {
            res.json(removedCampaign);
        });
    });
});

router.post('/get_query_column', (req, res) => {
    Settings.findOne({}, (err, setting) => {
        if (!setting || !setting.mdb_path) {
            res.json({status: 'error', description: 'Please input the MDB file path.'});
            return;
        }

        const mdb_path = setting.mdb_path;
        const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)}; DBQ=${mdb_path}; Uid=;Pwd=;`;

        ODBC.connect(connectionString, (error, connection) => {
            if (error) {
                res.json({status: 'error', description: "Please can't connect to this MDB file."});
                return;
            }

            connection.query(`SELECT TOP 1 * FROM [${req.body.query}]`, async (error, result) => {
                await connection.close();

                if (error) {
                    res.json({status: 'error', description: "Please can't run the this query."});
                    return;
                }

                const columns = result.columns.map(c => {
                    const column = c;
                    column.key = c._id;
                    return column;
                })
                res.json(columns);
            });
        });
    });
});

router.post('/update_field', (req, res) => {
    let set = {};
    const keys = Object.keys(req.body.updateFields);
    keys.forEach(key => {
        set[key] = req.body.updateFields[key];
    });
    Campaigns.updateOne({_id: req.body.campaignId}, set, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            res.json(docs);
        }});
});

module.exports = router;