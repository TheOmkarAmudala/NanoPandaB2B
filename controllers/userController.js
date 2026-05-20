import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {

   try {

      const {
         email,
         password
      } = req.body;

      // Find user
      const user = await User.findOne({
         email
      });

      if (!user) {

         return res.status(404).json({
            success: false,
            message: "User not found"
         });

      }

      // Check password
      const isMatch = await bcrypt.compare(
         password,
         user.password
      );

      if (!isMatch) {

         return res.status(400).json({
            success: false,
            message: "Invalid credentials"
         });

      }

      // Generate JWT
      const token = jwt.sign(

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
         token,
         user
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }

};