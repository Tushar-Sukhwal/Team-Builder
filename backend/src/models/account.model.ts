import mongoose, { Document, Schema } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/account-provider.enum";

export interface AccountDocument extends Document {
  provider: ProviderEnumType;
  providerId: string; // store the email, googleId, facebookId as the providerID (because unique)
  userId: mongoose.Types.ObjectId;
  refreshToken?: string;
  tokenExpiry?: Date | null;
  createdAt: Date;
}

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
    // hide the refreshToken from the response when converting to JSON
    toJSON: {
      transform(doc, ret) {
        delete ret.refreshToken;
      },
    },
  }
);


const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);

export default AccountModel;
