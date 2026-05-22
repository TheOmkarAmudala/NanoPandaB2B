import express from "express";

const router = express.Router();


import {
   enrollBiometric,
   getUserEmbeddings
} from "../controllers/biometricController.js";
import authMiddleware from "../middleware/authMiddleware.js";
router.get(
   "/embeddings/:userId",
   authMiddleware,
   getUserEmbeddings
);
router.post("/enroll",authMiddleware, enrollBiometric);

export default router;