import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// REGISTER USER
export const registerUser = async (req, res) => {

   try {

      const {
         name,
         email,
         password,
         companyName,
         role,
         websiteLink,
         monitoringDomain
      } = req.body;

      // Validate required fields
      if (
         !name ||
         !email ||
         !password ||
         !companyName
      ) {

         return res.status(400).json({
            success: false,
            message: "Please fill all required fields"
         });

      }

      // Check existing user
      const existingUser = await User.findOne({
         email
      });

      if (existingUser) {

         return res.status(400).json({
            success: false,
            message: "User already exists"
         });

      }

      // Hash password
      const hashedPassword = await bcrypt.hash(
         password,
         10
      );

      // Create user
      const user = await User.create({

         name,
         email,

         password: hashedPassword,

         companyName,

         role: role || "ADMIN",

         websiteLink: websiteLink || "",

         monitoringDomain: monitoringDomain || ""

      });

      // Generate JWT
      const token = jwt.sign(

         {
            id: user._id
         },

         process.env.JWT_SECRET,

         {
            expiresIn: "7d"
         }

      );

      return res.status(201).json({

         success: true,

         message: "Registration successful",

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