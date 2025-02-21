import { Schema, Types, model, Document } from "mongoose";

export interface MemberDocument extends Document {
    userId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    role: Types.ObjectId;
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
            ref: "workspace",
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
