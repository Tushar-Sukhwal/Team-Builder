/**
 * Authentication Service
 *
 * Provides functions for user authentication, registration, and verification.
 * Handles OAuth providers and email/password authentication.
 */
import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";

/**
 * Login or create a new user account based on OAuth provider data
 *
 * @param data - OAuth provider data
 * @param data.provider - Authentication provider (e.g., Google, Facebook)
 * @param data.displayName - User display name from the provider
 * @param data.providerId - Unique ID from the provider
 * @param data.picture - Optional profile picture URL
 * @param data.email - Optional email address
 * @returns Object containing the user
 */
export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  // Start MongoDB transaction to ensure data consistency
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started Session...");

    // Check if user with this email already exists
    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      // User doesn't exist - create new user account with OAuth data
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      // Create account record linking OAuth provider to user
      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });

      // Create a default workspace for the new user
      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      // Find owner role to assign proper permissions
      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      // Link user to workspace with owner role
      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      // Set current workspace for user
      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    // If all operations succeeded, commit transaction
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return { user };
  } catch (error) {
    // If any operation failed, rollback all changes
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    // Ensure session is always closed even if there's an error
    session.endSession();
  }
};

/**
 * Register a new user with email and password
 *
 * Creates a new user, account, workspace, and assigns owner role.
 *
 * @param body - User registration data
 * @param body.email - User email address
 * @param body.name - User full name
 * @param body.password - User password
 * @returns Object containing created user ID and workspace ID
 * @throws BadRequestException if email already exists
 * @throws NotFoundException if owner role not found
 */
export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  // Start MongoDB transaction to ensure data consistency
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if email is already registered
    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    // Create new user with email/password
    // Password hashing is handled by the model's pre-save hook
    const user = new UserModel({
      email,
      name,
      password,
    });
    await user.save({ session });

    // Create account record with email provider type
    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    // Create a default workspace for the new user
    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    // Find owner role to assign proper permissions
    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    // Link user to workspace with owner role
    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    // Set current workspace for user
    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    // If all operations succeeded, commit transaction
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    // Return IDs for client-side usage
    return {
      userId: user._id,
      workspaceId: workspace._id,
    };
  } catch (error) {
    // If any operation failed, rollback all changes
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

/**
 * Verify user credentials and retrieve user information
 *
 * @param email - User email address
 * @param password - User password to verify
 * @param provider - Authentication provider, defaults to EMAIL
 * @returns User object with password field omitted
 * @throws NotFoundException if account or user not found
 * @throws UnauthorizedException if password doesn't match
 */
export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  // Find account by provider and email
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    // Use generic error message to prevent user enumeration attacks
    throw new NotFoundException("Invalid email or password");
  }

  // Find the user associated with this account
  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  // Verify password against hashed value in database
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Use generic error message to prevent user enumeration attacks
    throw new UnauthorizedException("Invalid email or password");
  }

  // Return user object without sensitive password field
  return user.omitPassword();
};
