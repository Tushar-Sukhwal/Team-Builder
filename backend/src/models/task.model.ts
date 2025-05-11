import mongoose, { Document, Schema } from "mongoose";
import {
  TaskPriorityEnum,
  TaskPriorityEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "../enums/task.enum";
import { generateTaskCode } from "../utils/uuid";

/**
 * Interface representing a Task document in MongoDB.
 */
export interface TaskDocument extends Document {
  taskCode: string; // Unique code for the task
  title: string; // Title of the task
  description: string | null; // Description of the task
  project: mongoose.Types.ObjectId; // Reference to the associated project
  workspace: mongoose.Types.ObjectId; // Reference to the associated workspace
  status: TaskStatusEnumType; // Current status of the task
  priority: TaskPriorityEnumType; // Priority level of the task
  assignedTo: mongoose.Types.ObjectId | null; // Reference to the user assigned to the task
  createdBy: mongoose.Types.ObjectId; // Reference to the user who created the task
  dueDate: Date | null; // Due date for the task
  createdAt: Date; // Timestamp of when the task was created
  updatedAt: Date; // Timestamp of when the task was last updated
}

/**
 * Mongoose schema for the Task model.
 */
const taskSchema = new Schema<TaskDocument>(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode, // Generate a unique task code
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: null },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatusEnum),
      default: TaskStatusEnum.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriorityEnum),
      default: TaskPriorityEnum.MEDIUM,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema);
export default TaskModel;
