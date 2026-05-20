import express from "express";

import {
   loginUser,
  // getCurrentUser,
  registerUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);


export default router;