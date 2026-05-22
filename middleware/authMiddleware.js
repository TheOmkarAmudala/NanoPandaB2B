import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

   try {

      // Get token from headers
      const authHeader = req.headers.authorization;

      // Check token exists
      if (
         !authHeader ||
         !authHeader.startsWith("Bearer ")
      ) {

         return res.status(401).json({
            success: false,
            message: "No token provided"
         });

      }

      // Extract token
      const token = authHeader.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET
      );

      // Attach decoded data
      req.user = decoded;

      next();

   } catch (error) {

      return res.status(401).json({
         success: false,
         message: "Invalid or expired token"
      });

   }

};

export default authMiddleware;