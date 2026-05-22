import express from "express";

import {
   sendInvitation,acceptInvitation
} from "../controllers/invitationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/send",authMiddleware, sendInvitation);
router.post("/accept/:token", authMiddleware, acceptInvitation);

export default router;