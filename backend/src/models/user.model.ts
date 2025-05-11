import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

/**
 * Interface representing a User document in MongoDB.
 */
export interface UserDocument extends Document {
  name: string; // Name of the user
  email: string; // Email of the user
  password?: string; // Password of the user (hashed)
  profilePicture?: string; // URL of the user's profile picture
  isActive: boolean; // Status of the user's account
  lastLogin: Date | null; // Timestamp of the last login
  createdAt: Date; // Timestamp of when the user was created
  updatedAt: Date; // Timestamp of when the user was last updated
  currentWorkspace: mongoose.Types.ObjectId | null; // Reference to the current workspace
  comparePassword(value: string): Promise<boolean>; // Method to compare password
  omitPassword(): Omit<UserDocument, "password">; // Method to omit password from the response
}

/**
 * Mongoose schema for the User model.
 */
const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      select: true, // Include password in queries by default
    },
    profilePicture: { type: String, default: null },
    currentWorkspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

// Method to omit the password from the user object
userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
