import express from "express";

import {
   createPolicy,
   assignPolicy,
   getMyPolicy
} from "../controllers/policyController.js";

const router = express.Router();

router.post("/create", createPolicy);
router.post("/assign", assignPolicy);
router.get("/me/:userId", getMyPolicy);

export default router;