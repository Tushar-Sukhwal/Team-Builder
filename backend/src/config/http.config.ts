//This makes it easy to reference HTTP status codes by name instead of remembering numbers

/**
 * HTTP status codes configuration.
 * This object provides named constants for common HTTP status codes,
 * making it easier to reference them in the application.
 */
const httpConfig = () => ({
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
});

export const HTTPSTATUS = httpConfig();

export type HttpStatusCodeType = (typeof HTTPSTATUS)[keyof typeof HTTPSTATUS];
/*
typeof HTTPSTATUS gets the type of the HTTPSTATUS object (not its value, but its shape).

keyof typeof HTTPSTATUS produces a union of all the keys in that object (e.g., "OK" | "CREATED" | ...).

(typeof HTTPSTATUS)[keyof typeof HTTPSTATUS] is an indexed access type. It means: "Give me the type of all the values for each key in HTTPSTATUS."

In this case, since all values are numbers, this will resolve to just number.

But: If you ever add a non-number value (say, a string), the type will automatically update to include that type as well.
*/
