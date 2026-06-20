// controllers/alertController.js

import Alert from "../models/Alert.js";

export const createAlert = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.id
            );

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const {
            deviceId,
            username,
            eventType,
            severity,
            details
        } = req.body;

        const alert =
            await Alert.create({

                employeeId:
                    user._id,

                workspaceId:
                    user.workspaceId,

                deviceId,

                username,

                eventType,

                severity,

                details

            });

        return res.status(201).json({

            success: true,

            data: alert

        });

    } catch (error) {

        return res.status(500).json({

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

// controllers/alertController.js

export const deleteAlert = async (req, res) => {
    try {

        const { id } = req.params;

        const alert = await Alert.findByIdAndDelete(id);

        if (!alert) {
            return res.status(404).json({
                success: false,
                message: "Alert not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Alert deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

export const deleteAllAlerts = async (req, res) => {
    try {

        await Alert.deleteMany({});

        res.status(200).json({
            success: true,
            message: "All alerts deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};