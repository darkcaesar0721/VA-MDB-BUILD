const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: String,
    last_control_date: Date,
    last_input_date: Date,
    campaigns: [{
        detail: {
            type: mongoose.Schema.ObjectId,
            ref: 'Campaign'
        },
        weekday: {
            Monday: {
                type: Boolean,
                default: false,
            },
            Tuesday: {
                type: Boolean,
                default: false,
            },
            Wednesday: {
                type: Boolean,
                default: false,
            },
            Thursday: {
                type: Boolean,
                default: false,
            },
            Friday: {
                type: Boolean,
                default: false,
            },
            Saturday: {
                type: Boolean,
                default: false,
            },
            Sunday: {
                type: Boolean,
                default: false,
            },
        },
        whatsapp: {
            send_status: {
                type: Boolean,
                default: false
            },
            message: String,
            groups: [],
            users: []
        },
        color: {
            type: String,
            default: "none"
        },
        filter: {
            way: {
                type: String,
                enum: ['ALL', 'STATIC', 'RANDOM', 'RANDOM_FIRST', 'DATE', 'PERIOD'],
                default: 'ALL'
            },
            static_count: Number,
            random_start_position: Number,
            random_start: Number,
            random_end: Number,
            date_is_time: {
                type: Boolean,
                default: false
            },
            date_old_day: Number,
            date_time: Number,
            date_meridian: {
                type: String,
                enum: ['AM', 'PM'],
                default: 'AM'
            },
            date_virtual: Date,
            period_start: Number,
            period_end: Number,
        },
        comment: {
            type: String,
            default: ""
        },
        is_manually_upload: {
            type: Boolean,
            default: false
        },
        columns: [{
            mdb_name: String,
            sheet_name: String,
            is_display: {
                type: Boolean,
                default: true
            }
        }],
        last_uploaded_date: Date
    }]
});

const Groups = mongoose.model("Group", groupSchema);

module.exports = Groups;