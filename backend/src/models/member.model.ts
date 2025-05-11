import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

/**
 * Interface representing a Member document in MongoDB.
 */
export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  workspaceId: mongoose.Types.ObjectId; // Reference to the workspace
  role: RoleDocument; // Role assigned to the member
  joinedAt: Date; // Timestamp of when the member joined
}

/**
 * Mongoose schema for the Member model.
 */
const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel;
