import { Schema, model, Document } from "mongoose";

export interface ProjectDocument extends Document {
    name: string;
    description: string | null;
    emoji: string;
    workspaceId: Schema.Types.ObjectId;
    createdBy: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<ProjectDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: null,
        },
        emoji: {
            type: String,
            trim: true,
            default: "📊",
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = model("Project", projectSchema);

export default Project;
