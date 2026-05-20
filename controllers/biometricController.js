import BiometricProfile from "../models/BiometricProfile.js";

export const enrollBiometric = async (req, res) => {

   try {

      const {
         userId,
         workspaceId,
         faceEmbedding
      } = req.body;

      // Validation
      if (
         !userId ||
         !workspaceId ||
         !faceEmbedding
      ) {

         return res.status(400).json({
            success: false,
            message: "Missing required fields"
         });

      }

      // Check existing profile
      const existingProfile =
         await BiometricProfile.findOne({
            userId
         });

      if (existingProfile) {

         return res.status(400).json({
            success: false,
            message: "Biometric already enrolled"
         });

      }

      // Save profile
      const biometricProfile =
         await BiometricProfile.create({

            userId,
            workspaceId,
            faceEmbedding

         });

      return res.status(201).json({
         success: true,
         message: "Biometric enrolled successfully",
         biometricProfile
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};


export const getUserEmbeddings = async (req, res) => {

   try {

      const { userId } = req.params;

      // Find biometric profile
      const biometricProfile =
         await BiometricProfile.findOne({
            userId
         });

      // Not found
      if (!biometricProfile) {

         return res.status(404).json({
            success: false,
            message: "Biometric profile not found"
         });

      }

      return res.status(200).json({
         success: true,

         embeddings:
            biometricProfile.faceEmbedding
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};