import express from "express";

import {
   loginUser,
  // getCurrentUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);

export default router;