import express from "express";

import {

   createWorkspace,

   fetchUserWorkspaces,

   fetchSingleWorkspace,

   fetchWorkspaceInvites,

   deleteWorkspace

} from "../controllers/workspace.js";

const router = express.Router();

// CREATE
router.post(
   "/create",
   createWorkspace
);

// FETCH USER WORKSPACES
router.get(
   "/user/:userId",
   fetchUserWorkspaces
);

// FETCH SINGLE WORKSPACE
router.get(
   "/:workspaceId",
   fetchSingleWorkspace
);

// FETCH INVITES
router.get(
   "/:workspaceId/invites",
   fetchWorkspaceInvites
);

// DELETE WORKSPACE
router.delete(
   "/:workspaceId",
   deleteWorkspace
);

export default router;