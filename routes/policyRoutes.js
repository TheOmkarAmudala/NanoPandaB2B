import express from "express";

import {
   createPolicy,
   assignPolicy,
   getMyPolicy
} from "../controllers/policyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create",authMiddleware, createPolicy);
router.post("/assign", authMiddleware, assignPolicy);
router.get("/me/:userId", authMiddleware, getMyPolicy);

export default router;