import { Schema, model, Document } from "mongoose";
import {
    Permissions,
    PermissionType,
    Roles,
    RoleType,
} from "../enums/roleEnum";
import { RolePermissions } from "../utils/rolesPermission";

export interface RoleDocument extends Document {
    name: RoleType;
    permissions: Array<PermissionType>;
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            enum: Object.values(Roles),
            required: true,
            unique: true,
        },
        permissions: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RoleDocument) {
                return RolePermissions[this.name];
            },
        },
    },
    {
        timestamps: true,
    }
);

const Role = model<RoleDocument>("Role", roleSchema);

export default Role;
