import express from "express";

import {
   loginUser,
  // getCurrentUser,
  registerUser,
  getMyEmployees
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get(
    "/employees",
    authMiddleware,
    getMyEmployees
);

export default router;