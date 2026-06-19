// models/Alert.js

import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    eventType: {
        type: String,
        required: true
    },

    severity: {
        type: String,
        default: "LOW"
    },

    details: {
        type: String
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Alert", AlertSchema);