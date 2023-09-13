const express = require('express');
const router = express.Router();
const formidable = require('formidable');

const Settings = require('../models/setting.model');
const fs = require("fs");
const Campaigns = require("../models/campaign.model");
const Groups = require("../models/group.model");

const moment = require('moment-timezone');
moment.tz.setDefault('America/Los_Angeles');

router.get('/', (req, res) => {
    Settings.findOne({}, (err, setting) => {
        if (!setting) {
            Settings.create({}, (err, createdSetting) => {
                res.json(createdSetting);
            })
        } else {
            res.json(setting);
        }
    })
});

router.put('/:id', (req, res) => {
    Settings.findByIdAndUpdate(req.params.id, req.body, (err, updatedSetting) => {
        Settings.findOne({_id: req.params.id}, (err, setting) => {
            res.json(setting); //.json() will send proper headers in response so client knows it's json coming back
        });
    });
});

router.post('/backup', async (req, res) => {
    const settings = await Settings.find();
    const campaigns = await Campaigns.find();
    const groups = await Groups.find();

    const data = {
        settings: settings,
        campaigns: campaigns,
        groups: groups
    }

    const file_name = moment().format('Y_M_D_hh_mm_ss_A');

    fs.writeFile(settings[0].backup_path + '\\' + file_name + '.json', JSON.stringify(data), function(err) {
        if (err) throw err;
        res.json('success');
    });
});

router.post('/restore', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        fs.readFile(files.file[0].filepath, 'utf8', async (err, db) => {
            if (err) {
                console.error(err);
                return;
            }

            let data = db.replaceAll('"County.County":', '"County":');
            const settings = JSON.parse(data).settings;
            await Settings.find({'__v': 0}).remove().exec();
            await Settings.insertMany(settings);

            const campaigns = JSON.parse(data).campaigns;
            await Campaigns.find({'__v': 0}).remove().exec();
            await Campaigns.insertMany(campaigns);

            const groups = JSON.parse(data).groups;
            await Groups.find({'__v': 0}).remove().exec();
            await Groups.insertMany(groups);
            res.end();
        });

    });
})

module.exports = router;