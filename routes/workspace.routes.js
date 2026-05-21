import express from "express";

import {
   createWorkspace
} from "../controllers/workspace.controller.js";

const router = express.Router();

router.post(
   "/create",
   createWorkspace
);

export default router;