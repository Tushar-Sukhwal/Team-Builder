import { getEnv } from "../utils/get-env";

/**
 * Application configuration settings.
 * This function retrieves environment variables and provides default values.
 *
 * @returns {Object} Configuration object containing:
 * - NODE_ENV: The environment the app is running in (development, production, etc.)
 * - PORT: The port on which the server will listen.
 * - BASE_PATH: The base API path for the application.
 * - MONGO_URI: The MongoDB connection URI.
 * - SESSION_SECRET: Secret key for session management.
 * - SESSION_EXPIRES_IN: Duration for session expiration.
 * - GOOGLE_CLIENT_ID: Google OAuth client ID.
 * - GOOGLE_CLIENT_SECRET: Google OAuth client secret.
 * - GOOGLE_CALLBACK_URL: URL for Google OAuth callback.
 * - FRONTEND_ORIGIN: Allowed origin for CORS.
 * - FRONTEND_GOOGLE_CALLBACK_URL: Callback URL for frontend Google OAuth.
 */
const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "mongodb://localhost:27017"),

  SESSION_SECRET: getEnv("SESSION_SECRET"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),

  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),

  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "localhost"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
});

export const config = appConfig();
