// account.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";

/**
 * Interface representing an Account document in MongoDB.
 */
export interface AccountDocument extends Document {
  provider: ProviderEnumType; // The provider of the account (e.g., Google, Facebook)
  providerId: string; // Unique identifier for the provider
  userId: mongoose.Types.ObjectId; // Reference to the associated user
  refreshToken?: string; // Optional refresh token for the account
  tokenExpiry?: Date | null; // Optional expiry date for the token
  createdAt: Date; // Timestamp of when the account was created
}

/**
 * Mongoose schema for the Account model.
 */
const accountSchema = new Schema<AccountDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      unique: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Hide the refreshToken from the response when converting to JSON
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  }
);

const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;