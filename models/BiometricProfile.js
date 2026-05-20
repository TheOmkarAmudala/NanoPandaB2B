import mongoose from "mongoose";

const biometricProfileSchema = new mongoose.Schema({

   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
   },

   workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
   },

   faceEmbedding: {
      type: [Number],
      required: true
   },

   embeddingModel: {
      type: String,
      default: "MobileFaceNet"
   },

   embeddingVersion: {
      type: String,
      default: "v1"
   },

   facialVerificationEnabled: {
      type: Boolean,
      default: true
   },

   createdAt: {
      type: Date,
      default: Date.now
   }

});

export default mongoose.model(
   "BiometricProfile",
   biometricProfileSchema
);