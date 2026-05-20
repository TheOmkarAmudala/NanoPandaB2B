import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({

   workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace"
   },

   email: String,

   invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   },

   status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING"
   },

   consentText: String,

   requestedPermissions: [{
      type: String
   }],

   token: String,

   expiresAt: Date

}, {
   timestamps: true
});

export default mongoose.model("Invitation", invitationSchema);