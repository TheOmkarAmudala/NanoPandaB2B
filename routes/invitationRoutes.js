import express from "express";

import {
   sendInvitation,acceptInvitation, fetchMyInvitations, rejectInvitation
} from "../controllers/invitationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();


router.get(
   "/my",
   authMiddleware,
   fetchMyInvitations
);


router.post(
   "/:invitationId/reject",
   authMiddleware,
   rejectInvitation
);
router.post("/send",authMiddleware, sendInvitation);
router.post("/accept/:token", authMiddleware, acceptInvitation);

export default router;