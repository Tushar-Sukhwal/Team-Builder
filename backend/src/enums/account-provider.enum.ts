/**
 * Enumeration for different account providers.
 * This enum defines the various authentication providers supported by the application.
 */
export const ProviderEnum = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  FACEBOOK: "FACEBOOK",
  EMAIL: "EMAIL",
} as const;

export type ProviderEnumType = keyof typeof ProviderEnum; // Type for provider keys
