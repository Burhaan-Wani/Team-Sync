import mongoose from "mongoose";
import { TaskStatusEnum } from "../enums/taskStatusEnumType";
import Project from "../models/project.model";
import Task from "../models/task.model";
import { BadRequestError, NotFoundError } from "../utils/AppError";

export type createProjectServiceType = {
    workspaceId: string;
    userId: string;
    body: {
        name: string;
        description?: string;
        emoji?: string;
    };
};

export type updateProjectServiceType = Omit<
    createProjectServiceType,
    "userId"
> & {
    projectId: string;
};

export const createProjectService = async (data: createProjectServiceType) => {
    try {
        const {
            workspaceId,
            userId,
            body: { name, description, emoji },
        } = data;

        const existsProject = await Project.findOne({
            workspaceId,
            createdBy: userId,
            name,
        });

        if (existsProject) {
            throw new BadRequestError("Project already exists");
        }

        const project = await Project.create({
            name,
            description,
            emoji,
            workspaceId,
            createdBy: userId,
        });

        return { project };
    } catch (error) {
        throw error;
    }
};

export const getProjectInWorkspaceService = async (
    projectId: string,
    workspaceId: string
) => {
    try {
        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        }).select("_id name description emoji");

        if (!project) {
            throw new NotFoundError(
                "Project not found or does not belong to this workspace"
            );
        }

        return { project };
    } catch (error) {
        throw error;
    }
};

export const updateProjectService = async (data: updateProjectServiceType) => {
    try {
        const {
            workspaceId,
            projectId,
            body: { name, description, emoji },
        } = data;

        let project = await Project.findOne({ _id: projectId, workspaceId });
        if (!project) {
            throw new NotFoundError(
                "Project not found or does not belong to this workspace"
            );
        }
        project.name = name;
        project.description = description || null;
        project.emoji = emoji || "📊";

        project.save();
        return { project };
    } catch (error) {
        throw error;
    }
};

export const deleteProjectService = async (
    projectId: string,
    workspaceId: string
) => {
    try {
        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });
        if (!project) {
            throw new NotFoundError(
                "Project not found or does not belong to this workspace"
            );
        }
        await Project.deleteOne({
            _id: projectId,
        });
        await Task.deleteMany({
            projectId,
        });
    } catch (error) {
        throw error;
    }
};

export const getAllProjectsOfAWorkspaceService = async (
    workspaceId: string,
    pageSize: number,
    pageNumber: number
) => {
    try {
        const totalCount = await Project.countDocuments({
            workspaceId,
        });

        const skip = (pageNumber - 1) * pageSize;
        const projects = await Project.find({
            workspaceId,
        })
            .skip(skip)
            .limit(pageSize)
            .populate("createdBy", "_id name profilePicture -password");

        const totalPages = Math.ceil(totalCount / pageSize);
        return { projects, totalCount, totalPages, skip };
    } catch (error) {
        throw error;
    }
};

export const getProjectAnalyticsService = async (
    workspaceId: string,
    projectId: string
) => {
    try {
        const project = await Project.findOne({
            _id: projectId,
            workspaceId,
        });

        if (!project) {
            throw new NotFoundError(
                "Project not found or does not belong to this workspace"
            );
        }
        const currentDate = new Date();

        //USING Mongoose aggregate
        const taskAnalytics = await Task.aggregate([
            {
                $match: {
                    project: new mongoose.Types.ObjectId(projectId),
                },
            },
            {
                $facet: {
                    totalTasks: [{ $count: "count" }],
                    overdueTasks: [
                        {
                            $match: {
                                dueDate: { $lt: currentDate },
                                status: {
                                    $ne: TaskStatusEnum.DONE,
                                },
                            },
                        },
                        {
                            $count: "count",
                        },
                    ],
                    completedTasks: [
                        {
                            $match: {
                                status: TaskStatusEnum.DONE,
                            },
                        },
                        { $count: "count" },
                    ],
                },
            },
        ]);

        const _analytics = taskAnalytics[0];

        const analytics = {
            totalTasks: _analytics.totalTasks[0]?.count || 0,
            overdueTasks: _analytics.overdueTasks[0]?.count || 0,
            completedTasks: _analytics.completedTasks[0]?.count || 0,
        };

        return {
            analytics,
        };
    } catch (error) {
        throw error;
    }
};
