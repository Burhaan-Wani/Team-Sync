import { Schema, model, Document } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

export interface WorkspaceDocument extends Document {
    name: string;
    description?: string;
    owner: Schema.Types.ObjectId;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new Schema<WorkspaceDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        inviteCode: {
            type: String,
            default: generateInviteCode,
        },
    },
    {
        timestamps: true,
    }
);

workspaceSchema.methods.resetInviteCode = function () {
    this.inviteCode = generateInviteCode;
};

const Workspace = model<WorkspaceDocument>("Workspace", workspaceSchema);

export default Workspace;
