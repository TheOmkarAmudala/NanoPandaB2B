import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({

   name: {
      type: String,
      required: true
   },

   admins: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }],

   createdAt: {
      type: Date,
      default: Date.now
   }

});

export default mongoose.model(
   "Workspace",
   workspaceSchema
);