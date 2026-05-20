import express from "express";

const router = express.Router();


import {
   enrollBiometric,
   getUserEmbeddings
} from "../controllers/biometricController.js";

router.get(
   "/embeddings/:userId",
   getUserEmbeddings
);
router.post("/enroll", enrollBiometric);

export default router;