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

      const { token } = req.params;

      const {
         name,
         password
      } = req.body;

      // Find invitation
      const invitation = await Invitation.findOne({
         token
      });

      // Invalid invitation
      if (!invitation) {

         return res.status(404).json({
            success: false,
            message: "Invalid invitation"
         });

      }

      // Expiry check
      if (new Date() > invitation.expiresAt) {

         return res.status(400).json({
            success: false,
            message: "Invitation expired"
         });

      }

      // Already accepted
      if (invitation.status === "ACCEPTED") {

         return res.status(400).json({
            success: false,
            message: "Invitation already accepted"
         });

      }

      // Check if user already exists
      const existingUser = await User.findOne({
         email: invitation.email
      });

      if (existingUser) {

         return res.status(400).json({
            success: false,
            message: "User already exists"
         });

      }

      // Hash password
      const hashedPassword =
         await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({

         name,

         email: invitation.email,

         password: hashedPassword,

         workspaceId: invitation.workspaceId,

         role: "EMPLOYEE",

         consentAccepted: true

      });

      // Update invitation
      invitation.status = "ACCEPTED";

      await invitation.save();

      // Generate JWT
      const tokenJwt = jwt.sign(

         {
            id: user._id,
            workspaceId: user.workspaceId
         },

         process.env.JWT_SECRET,

         {
            expiresIn: "7d"
         }

      );

      return res.status(200).json({

         success: true,

         message: "Account created successfully",

         token: tokenJwt,

         user

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

      });

   }

};