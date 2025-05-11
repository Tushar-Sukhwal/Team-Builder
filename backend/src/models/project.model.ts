import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing a Project document in MongoDB.
 */
export interface ProjectDocument extends Document {
  name: string; // Name of the project
  description: string | null; // Description of the project
  emoji: string; // Emoji representing the project
  workspace: mongoose.Types.ObjectId; // Reference to the associated workspace
  createdBy: mongoose.Types.ObjectId; // Reference to the user who created the project
  createdAt: string; // Timestamp of when the project was created
  updatedAt: string; // Timestamp of when the project was last updated
}

/**
 * Mongoose schema for the Project model.
 */
const projectSchema = new Schema<ProjectDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    emoji: { type: String, required: true, trim: true, default: "🚀" },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model<ProjectDocument>("Project", projectSchema);
export default ProjectModel;
