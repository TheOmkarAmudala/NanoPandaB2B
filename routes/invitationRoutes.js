import express from "express";

import {
   sendInvitation,acceptInvitation
} from "../controllers/invitationController.js";

const router = express.Router();

router.post("/send", sendInvitation);
router.post("/accept/:token", acceptInvitation);

export default router;