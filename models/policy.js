import mongoose from "mongoose";

const policySchema = new mongoose.Schema({

   workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace"
   },

   name: String,

   monitoredApps: [{
      appName: String,
      processName: String
   }],

   sensitiveApps: [{
      appName: String,
      processName: String,
      requireFacialVerification: Boolean
   }],

   securityRules: {

      insiderThreatDetection: {
         type: Boolean,
         default: true
      },

      screenCaptureDetection: {
         type: Boolean,
         default: false
      },

      multipleFaceDetection: {
         type: Boolean,
         default: true
      }

   }

}, {
   timestamps: true
});


export default mongoose.model("policySchema", policySchema);