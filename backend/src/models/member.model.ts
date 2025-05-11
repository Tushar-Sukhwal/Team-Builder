import mongoose, { Document, Schema } from "mongoose";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
  }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);

export default MemberModel;