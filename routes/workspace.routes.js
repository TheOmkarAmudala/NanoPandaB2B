import express from "express";

import {

   createWorkspace,

   fetchUserWorkspaces,

   fetchSingleWorkspace,

   fetchWorkspaceInvites,

   deleteWorkspace

} from "../controllers/workspace.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// CREATE
router.post(
   "/create",
   authMiddleware,
   createWorkspace
);

// FETCH USER WORKSPACES
router.get(
   "/user",
   authMiddleware,
   fetchUserWorkspaces
);

// FETCH SINGLE WORKSPACE
router.get(
   "/:workspaceId",
   authMiddleware,
   fetchSingleWorkspace
);

// FETCH INVITES
router.get(
   "/:workspaceId/invites",
   authMiddleware,
   fetchWorkspaceInvites
);

// DELETE WORKSPACE
router.delete(
   "/:workspaceId",
   authMiddleware,
   deleteWorkspace
);

export default router;