// routes/alertRoutes.js

import express from "express";

import {
    createAlert,
    getAlerts,
    deleteAlert,
    deleteAllAlerts

} from "../controllers/alertController.js";

const router = express.Router();

router.post("/create", createAlert);

router.get("/all", getAlerts);
router.delete("/delete/:id", deleteAlert);
router.delete("/delete-all", deleteAllAlerts);
export default router;