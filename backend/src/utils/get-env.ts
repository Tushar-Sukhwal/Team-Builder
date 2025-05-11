/**
 * Utility function to retrieve environment variables.
 *
 * @param {string} key - The name of the environment variable.
 * @param {string} [defaultValue=""] - The default value to return if the variable is not set.
 * @returns {string} - The value of the environment variable or the default value.
 * @throws {Error} - Throws an error if the variable is not set and no default value is provided.
 */
export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
