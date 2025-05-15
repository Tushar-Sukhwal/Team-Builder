/**
 * Passport Authentication Configuration
 *
 * This file configures Passport.js authentication strategies, including:
 * - Google OAuth 2.0 strategy for social login
 * - Local strategy for email/password authentication
 *
 * It also configures session serialization and deserialization.
 */
import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  loginOrCreateAccountService,
  verifyUserService,
} from "../services/auth.service";

/**
 * Google OAuth 2.0 Strategy
 *
 * Authenticates users with Google accounts and either:
 * - Creates a new user account if it doesn't exist
 * - Logs in an existing user
 */
passport.use(
  new GoogleStrategy(
    {
      // Google OAuth configuration from environment variables
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"], // Request user profile and email from Google
      passReqToCallback: true, // Pass the request object to the callback function
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const { email, sub: googleId, picture } = profile._json;
        console.log(profile, "profile");
        console.log(googleId, "googleId");
        if (!googleId) {
          throw new NotFoundException("Google ID (sub) is missing");
        }

        // Login or create a new account using the service
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        // Pass the user to Passport.js for authentication
        done(null, user);
      } catch (error) {
        // Handle authentication errors
        done(error, false);
      }
    }
  )
);

/**
 * Local Strategy for Email/Password Authentication
 *
 * Authenticates users with email and password credentials.
 * Uses the verifyUserService to validate credentials.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Use email field as username
      passwordField: "password", // Specify password field
      session: true, // Enable session support
    },
    async (email, password, done) => {
      try {
        // Verify user credentials using the service
        const user = await verifyUserService({ email, password });
        return done(null, user);
      } catch (error: any) {
        // Handle authentication errors and pass error message
        return done(error, false, { message: error?.message });
      }
    }
  )
);

/**
 * Session Serialization/Deserialization
 *
 * Configures how user objects are stored in and retrieved from sessions.
 * Simple implementation that directly saves and retrieves the entire user object.
 */
// Store user in session
passport.serializeUser((user: any, done) => done(null, user));
// Retrieve user from session
passport.deserializeUser((user: any, done) => done(null, user));
