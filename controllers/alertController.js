// controllers/alertController.js

import Alert from "../models/Alert.js";

export const createAlert = async (req, res) => {
    try {

        const {
            deviceId,
            username,
            eventType,
            severity,
            details
        } = req.body;

        const alert = await Alert.create({
            deviceId,
            username,
            eventType,
            severity,
            details
        });

        res.status(201).json({
            success: true,
            message: "Alert saved",
            data: alert
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


export const getAlerts = async (req, res) => {
    try {

        const alerts = await Alert.find()
            .sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};