import { Schema, model, Document } from "mongoose";
import {
    TaskPriorityEnum,
    TaskPriorityEnumType,
    TaskStatusEnum,
    TaskStatusEnumType,
} from "../enums/taskStatusEnumType";
import { generateTaskCode } from "../utils/uuid";

export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    projectId: Schema.Types.ObjectId;
    workspaceId: Schema.Types.ObjectId;
    status: TaskStatusEnumType;
    priority: TaskPriorityEnumType;
    assignedTo: Schema.Types.ObjectId | null;
    createdBy: Schema.Types.ObjectId;
    dueDate: Date | null;
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
        title: {
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
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Task = model<TaskDocument>("Task", taskSchema);

export default Task;
