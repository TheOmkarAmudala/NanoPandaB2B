import Workspace from "../models/workspace.js";
import User from "../models/User.js";
import Invitation from "../models/invitation.js";

// ==============================
// CREATE WORKSPACE
// ==============================
export const createWorkspace = async (req, res) => {

   try {

      const {
         name,
         adminId
      } = req.body;

      // VALIDATION
      if (!name || !adminId) {

         return res.status(400).json({

            success: false,
            message: "Workspace name and adminId are required"

         });

      }

      // CHECK ADMIN EXISTS
      const adminUser = await User.findById(adminId);

      if (!adminUser) {

         return res.status(404).json({

            success: false,
            message: "Admin user not found"

         });

      }

      // CREATE WORKSPACE
      const workspace = await Workspace.create({

         name,

         admins: [adminId]

      });

      // UPDATE USER
      adminUser.workspaceId = workspace._id;

      adminUser.role = "ADMIN";

      await adminUser.save();

      return res.status(201).json({

         success: true,

         message: "Workspace created successfully",

         workspace

      });

   } catch (error) {

      return res.status(500).json({

         success: false,

         message: error.message

      });

   }

};

// ==============================
// FETCH ALL USER WORKSPACES
// ==============================
export const fetchUserWorkspaces = async (req, res) => {

   try {

      const {
         userId
      } = req.params;

      // FIND USER
      const user = await User.findById(userId);

      if (!user) {

         return res.status(404).json({

            success: false,
            message: "User not found"

         });

      }

      // FETCH WORKSPACES
      const workspaces = await Workspace.find({

         admins: userId

      }).populate("admins", "name email role");

      return res.status(200).json({

         success: true,

         count: workspaces.length,

         workspaces

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

      });

   }

};

// ==============================
// FETCH SINGLE WORKSPACE
// ==============================
export const fetchSingleWorkspace = async (req, res) => {

   try {

      const {
         workspaceId
      } = req.params;

      const workspace = await Workspace.findById(
         workspaceId
      ).populate(
         "admins",
         "name email role"
      );

      if (!workspace) {

         return res.status(404).json({

            success: false,
            message: "Workspace not found"

         });

      }

      return res.status(200).json({

         success: true,

         workspace

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

      });

   }

};

// ==============================
// FETCH WORKSPACE INVITATIONS
// ==============================
export const fetchWorkspaceInvites = async (req, res) => {

   try {

      const {
         workspaceId
      } = req.params;

      // CHECK WORKSPACE EXISTS
      const workspace = await Workspace.findById(
         workspaceId
      );

      if (!workspace) {

         return res.status(404).json({

            success: false,
            message: "Workspace not found"

         });

      }

      // FETCH INVITES
      const invites = await Invitation.find({

         workspaceId

      }).sort({
         createdAt: -1
      });

      return res.status(200).json({

         success: true,

         count: invites.length,

         invites

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

      });

   }

};

// ==============================
// DELETE WORKSPACE
// ==============================
export const deleteWorkspace = async (req, res) => {

   try {

      const {
         workspaceId
      } = req.params;

      // FIND WORKSPACE
      const workspace = await Workspace.findById(
         workspaceId
      );

      if (!workspace) {

         return res.status(404).json({

            success: false,
            message: "Workspace not found"

         });

      }

      // DELETE WORKSPACE
      await Workspace.findByIdAndDelete(
         workspaceId
      );

      // REMOVE WORKSPACE FROM USERS
      await User.updateMany(

         {
            workspaceId
         },

         {
            $unset: {
               workspaceId: ""
            }
         }

      );

      return res.status(200).json({

         success: true,
         message: "Workspace deleted successfully"

      });

   } catch (error) {

      return res.status(500).json({

         success: false,
         message: error.message

      });

   }

};