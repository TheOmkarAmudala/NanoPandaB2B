import Invitation from "../models/invitation.js";
import User from "../models/User.js";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Workspace from "../models/workspace.js";

export const sendInvitation = async (req, res) => {

   try {

      const {
         workspaceId,
         email,
         consentText,
         requestedPermissions
      } = req.body;

      // GET INVITER FROM JWT
      const invitedBy = req.user.id;

      // VALIDATION
      if (
         !workspaceId ||
         !email ||
         !consentText
      ) {

         return res.status(400).json({

            success: false,
            message: "Missing required fields"

         });

      }

      // CHECK INVITER EXISTS
      const inviter = await User.findById(invitedBy);

      if (!inviter) {

         return res.status(404).json({

            success: false,
            message: "Inviter not found"

         });

      }

      // CHECK WORKSPACE EXISTS
      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {

         return res.status(404).json({

            success: false,
            message: "Workspace not found"

         });

      }

      // CHECK INVITER BELONGS TO WORKSPACE
      const isWorkspaceAdmin = workspace.admins.some(

         (adminId) =>
            adminId.toString() === invitedBy

      );

      if (!isWorkspaceAdmin) {

         return res.status(403).json({

            success: false,
            message: "Unauthorized to invite users"

         });

      }

      // CHECK EMPLOYEE EXISTS
      const existingUser = await User.findOne({

         email: email.toLowerCase().trim()

      });

      if (!existingUser) {

         return res.status(404).json({

            success: false,
            message: "Employee account not found"

         });

      }

      // CHECK EXISTING PENDING INVITATION
      const alreadyInvited = await Invitation.findOne({

         email: email.toLowerCase().trim(),

         workspaceId,

         status: "PENDING"

      });

      if (alreadyInvited) {

         return res.status(409).json({

            success: false,
            message: "Invitation already pending"

         });

      }

      // GENERATE SECURE TOKEN
      const token = crypto.randomUUID();

      // SET EXPIRY (3 DAYS)
      const expiresAt = new Date(

         Date.now() + 3 * 24 * 60 * 60 * 1000

      );

      // CREATE INVITATION
      const invitation = await Invitation.create({

         workspaceId,

         email: email.toLowerCase().trim(),

         invitedBy,

         consentText: consentText.trim(),

         requestedPermissions,

         token,

         expiresAt,

         status: "PENDING"

      });

      return res.status(201).json({

         success: true,

         message: "Invitation sent successfully",

         invitation

      });

   } catch (error) {

      console.error("SEND INVITATION ERROR:", error);

      return res.status(500).json({

         success: false,

         message: "Internal server error"

      });

   }

};

// ACCEPT INVITATION + CREATE ACCOUNT
export const acceptInvitation = async (req, res) => {

   try {

      const { invitationId } = req.params;

      const userId = req.user.id;

      // GET USER
      const user = await User.findById(userId);

      if (!user) {

         return res.status(404).json({

            success: false,
            message: "User not found"

         });

      }

      // FIND INVITATION
      const invitation = await Invitation.findById(
         invitationId
      );

      if (!invitation) {

         return res.status(404).json({

            success: false,
            message: "Invitation not found"

         });

      }

      // SECURITY CHECK
      if (invitation.email !== user.email) {

         return res.status(403).json({

            success: false,
            message: "Unauthorized invitation access"

         });

      }

      // STATUS CHECK
      if (invitation.status !== "PENDING") {

         return res.status(400).json({

            success: false,
            message: "Invitation already processed"

         });

      }

      // EXPIRY CHECK
      if (new Date() > invitation.expiresAt) {

         invitation.status = "EXPIRED";

         await invitation.save();

         return res.status(400).json({

            success: false,
            message: "Invitation expired"

         });

      }

      // UPDATE USER
      user.workspaceId = invitation.workspaceId;

      user.role = "EMPLOYEE";

      user.consentAccepted = true;

      await user.save();

      // UPDATE INVITATION
      invitation.status = "ACCEPTED";

      await invitation.save();

      return res.status(200).json({

         success: true,

         message: "Invitation accepted successfully"

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,
         message: "Internal server error"

      });

   }

};

export const rejectInvitation = async (req, res) => {

   try {

      const { invitationId } = req.params;

      const userId = req.user.id;

      // GET USER
      const user = await User.findById(userId);

      if (!user) {

         return res.status(404).json({

            success: false,
            message: "User not found"

         });

      }

      // FIND INVITATION
      const invitation = await Invitation.findById(
         invitationId
      );

      if (!invitation) {

         return res.status(404).json({

            success: false,
            message: "Invitation not found"

         });

      }

      // SECURITY CHECK
      if (invitation.email !== user.email) {

         return res.status(403).json({

            success: false,
            message: "Unauthorized invitation access"

         });

      }

      // CHECK STATUS
      if (invitation.status !== "PENDING") {

         return res.status(400).json({

            success: false,
            message: "Invitation already processed"

         });

      }

      // REJECT
      invitation.status = "REJECTED";

      await invitation.save();

      return res.status(200).json({

         success: true,

         message: "Invitation rejected"

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,
         message: "Internal server error"

      });

   }

};

export const fetchMyInvitations = async (req, res) => {

   try {

      const userId = req.user.id;

      // GET USER
      const user = await User.findById(userId);

      if (!user) {

         return res.status(404).json({

            success: false,
            message: "User not found"

         });

      }

      // FETCH PENDING INVITATIONS
      const invitations = await Invitation.find({

         email: user.email,

         status: "PENDING",

         expiresAt: { $gt: new Date() }

      })

      .populate("workspaceId", "name")
      .populate("invitedBy", "name email");

      return res.status(200).json({

         success: true,

         count: invitations.length,

         invitations

      });

   } catch (error) {

      console.error(error);

      return res.status(500).json({

         success: false,
         message: "Internal server error"

      });

   }

};