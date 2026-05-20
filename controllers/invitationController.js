import Invitation from "../models/invitation.js";
import User from "../models/User.js";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// SEND INVITATION
export const sendInvitation = async (req, res) => {

   try {

      const {
         workspaceId,
         email,
         consentText,
         requestedPermissions,
         invitedBy
      } = req.body;

      // Generate secure token
      const token = crypto.randomUUID();

      // Expiry: 3 days
      const expiresAt = new Date(
         Date.now() + 3 * 24 * 60 * 60 * 1000
      );

      // Save invitation
      const invitation = await Invitation.create({

         workspaceId,
         email,
         invitedBy,
         consentText,
         requestedPermissions,
         token,
         expiresAt

      });

      return res.status(201).json({

         success: true,
         message: "Invitation sent successfully",
         invitation

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

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