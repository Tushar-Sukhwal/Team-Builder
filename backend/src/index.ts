import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: config.NODE_ENV === "production", // Set to true in production
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: "lax", // CSRF protection
  })
);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true, // Allow credentials to be sent
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "Welcome to the backend API",
  });
});

app.listen(config.PORT, async () => {
  console.log(
    `server is listening on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
});
