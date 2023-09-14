const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    backup_path: String,
    mdb_path: String,
    schedule_path: String,
    whatsapp: {
        global_send_status: {
            type: Boolean,
            default: true,
        },
        default_message_template: String,
        ultramsg_instance_id: String,
        ultramsg_token: String
    },
    current_upload: {
        group: {
            type: mongoose.Schema.ObjectId,
            ref: 'Group'
        },
        way: {
            type: String,
            enum: ['ALL', 'ONE'],
            default: 'ALL'
        },
        cancel_status: {
            type: Boolean,
            default: false
        }
    },
});

const Settings = mongoose.model("Setting", settingSchema);

module.exports = Settings;