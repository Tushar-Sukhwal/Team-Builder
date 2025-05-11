import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/roles-permission";

/**
 * Seeds the roles into the database.
 * This function connects to the database, clears existing roles,
 * and populates the database with predefined roles and their permissions.
 */
const seedRoles = async () => {
  console.log("Seeding roles...");

  try {
    // Connect to the database explicitly since this file is not linked to index.ts
    await connectDatabase();

    // Start a new session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    console.log("Clearing existing roles...");
    // Remove all existing roles from the database within the session
    await RoleModel.deleteMany({}, { session });

    // Iterate over each role defined in RolePermissions
    for (const roleName in RolePermissions) {
      const role = roleName as keyof typeof RolePermissions; // Cast roleName to the appropriate type
      const permissions = RolePermissions[role]; // Get permissions associated with the role

      // Check if the role already exists in the database
      const existingRole = await RoleModel.findOne({ name: role }).session(
        session
      );
      if (existingRole) {
        console.log(`Role ${role} already exists`);
        continue; // Skip to the next role if it already exists
      }

      // Create a new role instance with the name and permissions
      const newRole = new RoleModel({
        name: role,
        permissions,
      });
      // Save the new role to the database within the session
      await newRole.save({ session });
    }

    // Commit the transaction to save all changes
    await session.commitTransaction();
    console.log("Roles seeded successfully");

    // End the session after the transaction is complete
    session.endSession();
    console.log("Session ended");
  } catch (error) {
    // Log any errors that occur during the seeding process
    console.log("Error seeding roles:", error);
  }
};

seedRoles().catch((error) =>
  console.error("Error running the seed script", error)
);
