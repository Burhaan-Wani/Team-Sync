import { Schema, Types, model, Document } from "mongoose";
import {
    TaskPriorityEnum,
    TaskPriorityEnumType,
    TaskStatusEnum,
    TaskStatusEnumType,
} from "../enums/TaskStatusEnumType";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument extends Document {
    taskCode: string;
    name: string;
    description: string | null;
    projectId: Types.ObjectId;
    workspaceId: Types.ObjectId;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: Types.ObjectId | null;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
    {
        taskCode: {
            type: String,
            unique: true,
            default: generateTaskCode,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: null,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(TaskStatusEnum),
            default: TaskStatusEnum.TODO,
        },
        priority: {
            type: String,
            enum: Object.values(TaskPriorityEnum),
            default: TaskPriorityEnum.MEDIUM,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
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

const Task = model<TaskDocument>("Task", taskSchema);

export default Task;
