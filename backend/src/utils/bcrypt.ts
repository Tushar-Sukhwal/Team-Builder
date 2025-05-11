import bcrypt from "bcrypt";

/**
 * Utility functions for hashing and comparing passwords using bcrypt.
 */

/**
 * Hashes a given value using bcrypt.
 *
 * @param {string} value - The value to hash.
 * @param {number} [saltRounds=10] - The number of salt rounds to use (default is 10).
 * @returns {Promise<string>} - The hashed value.
 */
export const hashValue = async (value: string, saltRounds: number = 10) => {
  return await bcrypt.hash(value, saltRounds);
};

/**
 * Compares a given value with a hashed value using bcrypt.
 *
 * @param {string} value - The value to compare.
 * @param {string} hashedValue - The hashed value to compare against.
 * @returns {Promise<boolean>} - True if the values match, false otherwise.
 */
export const compareValue = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};
