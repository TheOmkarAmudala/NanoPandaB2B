const mongoose = require("mongoose");

const softwareSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true,
            trim: true,
        },

        deviceName: {
            type: String,
            required: true,
            trim: true,
        },

        software: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },

                version: {
                    type: String,
                    default: "Unknown",
                },
            },
        ],

        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Software", softwareSchema);