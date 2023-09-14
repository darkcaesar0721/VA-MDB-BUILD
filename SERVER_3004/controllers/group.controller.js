const express = require('express');
const router = express.Router();

const Groups = require('../models/group.model');
const Settings = require("../models/setting.model");

router.get('/', (req, res) => {
    Groups.find({}).exec((err, groups) => {
        res.json(groups);
    })
});

router.post('/', (req, res) => {
    Groups.create(req.body, (err, newGroup) => {
        res.json(newGroup);
    });
});

router.put('/:id', (req, res) => {
    Groups.findByIdAndUpdate(req.params.id, req.body, (err, updatedGroup) => {
        Groups.findOne({_id: req.params.id}, (err, group) => {
            res.json(group);
        });
    });
});

router.delete('/:id', (req, res) => {
    Groups.findByIdAndRemove(req.params.id, (err, removedGroup) => {
        res.json(removedGroup);
    });
});

router.post('/update_campaign_field', (req, res) => {
    let set = {};
    const keys = Object.keys(req.body.updateFields);
    keys.forEach(key => {
        set["campaigns.$." + key] = req.body.updateFields[key];
    });
    Groups.updateOne({_id: req.body.groupId, "campaigns._id": req.body.campaignId}, set, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            res.json('success');
        }});
});

router.post('/get_upload_time', async (req, res) => {
    const groupId = req.body.groupId;
    const campaignId = req.body.campaignId;

    const groups = await Groups.find();
    const group = groups.filter(g => g._id == groupId)[0];
    const campaigns = group.campaigns;
    const campaign = campaigns.filter(c => c.detail == campaignId)[0];

    Settings.findOne({}, (err, setting) => {
        res.json({
            uploadDateTime: {
                last_upload_start_datetime: campaign.last_upload_start_datetime,
                last_upload_end_datetime: campaign.last_upload_end_datetime,
            },
            setting: setting
        });
    })


});

module.exports = router;