import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace"
    },

    deviceId: String,

    username: String,

    eventType: String,

    severity: String,

    details: String

}, {
    timestamps: true
});

export default mongoose.model(
    "Alert",
    alertSchema
);