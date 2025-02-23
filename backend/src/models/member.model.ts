import { Schema, model, Document } from "mongoose";
import { RoleDocument } from "./rolePermissions.model";

export interface MemberDocument extends Document {
    userId: Schema.Types.ObjectId;
    workspaceId: Schema.Types.ObjectId;
    role: RoleDocument;
    joinedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Member = model<MemberDocument>("Member", memberSchema);

export default Member;
