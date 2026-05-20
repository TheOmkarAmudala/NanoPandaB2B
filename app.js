import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import invitationRoutes from "./routes/invitationRoutes.js";
import biometricRoutes from "./routes/biometricRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());





mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/biometric", biometricRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
   console.log(`Server running on ${PORT}`);
});