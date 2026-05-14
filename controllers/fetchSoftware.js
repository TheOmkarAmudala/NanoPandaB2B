const Software = require("../models/software");

exports.receiveSoftwareData = async (req, res) => {
    try {
        const {
            employeeId,
            organizationId,
            softwareName,
            processName,
            riskLevel,
            logs,
            timestamp,
            deviceInfo,
        } = req.body;

        // Required validation
        if (
            !employeeId ||
            !organizationId ||
            !softwareName
        ) {
            return res.status(400).json({
                status: "error",
                message: "Missing required fields",
            });
        }

        // Create structured document
        const software = await Software.create({
            employeeId,
            organizationId,
            softwareName,
            processName: processName || null,
            riskLevel: riskLevel || "LOW",
            logs: logs || [],
            deviceInfo: deviceInfo || {},
            timestamp: timestamp || new Date(),
            receivedAt: new Date(),
        });

        return res.status(201).json({
            status: "success",
            message: "Software telemetry received successfully",
            data: software,
        });

    } catch (err) {
        console.error("receiveSoftwareData error:", err);

        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};