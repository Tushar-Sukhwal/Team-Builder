import mongoose from "mongoose";
import { config } from "./app.config";

/**
 * Connects to the MongoDB database using Mongoose.
 * Logs a success message upon successful connection or exits the process on failure.
 */
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Mongo database");
  } catch (error) {
    console.log("Error connecting to Mongo database");
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDatabase;
