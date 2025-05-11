import mongoose, { Document, Schema } from "mongoose";
import { PermissionType, RoleType } from "../enums/role.enum";

export interface RolePermissionDocument extends Document {
  name: RoleType;
  permissions: Array<PermissionType>;
}
