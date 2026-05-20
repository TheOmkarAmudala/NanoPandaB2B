import Policy from "../models/Policy.js";
import User from "../models/User.js";

export const createPolicy = async (req, res) => {

   try {

      const {
         workspaceId,
         name,
         monitoredApps,
         sensitiveApps,
         securityRules
      } = req.body;

      const policy = await Policy.create({

         workspaceId,
         name,
         monitoredApps,
         sensitiveApps,
         securityRules

      });

      return res.status(201).json({
         success: true,
         message: "Policy created successfully",
         policy
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};


export const assignPolicy = async (req, res) => {

   try {

      const {
         userId,
         policyId
      } = req.body;

      const user = await User.findById(userId);

      if (!user) {

         return res.status(404).json({
            success: false,
            message: "User not found"
         });

      }

      user.assignedPolicy = policyId;

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Policy assigned successfully",
         user
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};



export const getMyPolicy = async (req, res) => {

   try {

      const { userId } = req.params;

      const user = await User.findById(userId)
      .populate("assignedPolicy");

      if (!user) {

         return res.status(404).json({
            success: false,
            message: "User not found"
         });

      }

      return res.status(200).json({
         success: true,
         policy: user.assignedPolicy
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};

