import Workspace from "../models/workspace.js";
import User from "../models/User.js";

// CREATE WORKSPACE
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

      // UPDATE USER WORKSPACE
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