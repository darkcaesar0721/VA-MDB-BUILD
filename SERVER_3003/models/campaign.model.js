const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
    query: String,
    schedule: String,
    sheet_urls: [],
    columns: [{
        mdb_name: String,
        sheet_name: String,
        is_display: {
            type: Boolean,
            default: true
        }
    }],
    qty_available: Number,
    qty_uploaded: Number,
    qty_schedule: Number,
    last_upload_datetime: Date,
    last_phone: String,
    is_manually_uploaded: {
        type: Boolean,
        default: false
    },
    is_get_last_phone: {
        type: Boolean,
        default: false
    },
    system_create_datetime: Date,
    last_temp_upload_info: {
        qty_available: Number,
        qty_uploaded: Number,
        qty_schedule: Number,
        last_phone: String,
        system_create_datetime: Date,
        upload_rows: []
    },
    last_upload_rows: []
});

const Campaigns = mongoose.model("Campaign", campaignSchema);

module.exports = Campaigns;