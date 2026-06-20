// routes/alertRoutes.js

import express from "express";

import {
    createAlert,
    getAlerts,
    deleteAlert,
    deleteAllAlerts,
    getEmployeeAlerts

} from "../controllers/alertController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createAlert);
router.get(
    "/employee/:employeeId",
    authMiddleware,
    getEmployeeAlerts
);
router.get("/all",authMiddleware, getAlerts);
router.delete("/delete/:id",authMiddleware, deleteAlert);
router.delete("/delete-all", authMiddleware, deleteAllAlerts);
export default router;