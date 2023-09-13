const express = require('express');
const router = express.Router();

const settingController = require('./setting.controller');
const campaignController = require('./campaign.controller');
const groupController = require('./group.controller');
const uploadController = require('./upload.controller');

router.use('/setting', settingController);
router.use('/campaign', campaignController);
router.use('/group', groupController);
router.use('/upload', uploadController);

module.exports = router;