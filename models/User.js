import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

   name: String,

   email: {
      type: String,
      unique: true
   },

   password: String,

   workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace"
   },

   role: {
      type: String,
      enum: ["ADMIN", "EMPLOYEE"],
      default: "EMPLOYEE"
   },

   consentAccepted: {
      type: Boolean,
      default: false
   },

   assignedPolicy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy"
   }

}, {
   timestamps: true
});

export default mongoose.models.User ||
mongoose.model("User", userSchema); 