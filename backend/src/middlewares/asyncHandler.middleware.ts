import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle asynchronous route handlers.
 * This middleware wraps an async controller function and catches any errors,
 * passing them to the next middleware for error handling.
 *
 * @param {AsyncControllerType} controller - The async controller function to wrap.
 * @returns {AsyncControllerType} - The wrapped controller function.
 */
type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (controller: AsyncControllerType): AsyncControllerType =>
  async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  };

// this file is made so that in every request you dont need to call next(error) in each request;
// earlier you needed to
/* 
app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(HTTPSTATUS.OK).json({
      message: "Welcome to the backend API",
    });
  } catch (error) {
    next(error);
  }
});
*/
//but now
/* 
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Welcome to the backend API",
    });
  })
);
*/
