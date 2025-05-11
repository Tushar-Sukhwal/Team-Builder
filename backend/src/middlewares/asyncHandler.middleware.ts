import { NextFunction, Request, Response } from "express";

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
      next(error);
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
