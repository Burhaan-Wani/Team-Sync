import { NextFunction, Request, Response } from "express";
import catchAsync from "../middlewares/catchAsync";
import { validateReqBody } from "../utils/ZodError";
import {
    createProjectSchema,
    updateProjectSchema,
} from "../validations/project.validations";
import { getMemberRoleInWorkspace } from "../services/workspace.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/roleEnum";
import {
    createProjectService,
    deleteProjectService,
    getAllProjectsOfAWorkspaceService,
    getProjectAnalyticsService,
    getProjectInWorkspaceService,
    updateProjectService,
} from "../services/project.service";
import { HTTPSTATUS } from "../config/http.config";

export const createProject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        validateReqBody(createProjectSchema, req, next);
        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_PROJECT]);

        const { project } = await createProjectService({
            workspaceId,
            userId,
            body: req.body,
        });

        res.status(HTTPSTATUS.CREATED).json({
            status: "success",
            message: "Project created successfully",
            project,
        });
    }
);

export const getProjectInWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { project } = await getProjectInWorkspaceService(
            projectId,
            workspaceId
        );

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Project fetched successfully",
            project,
        });
    }
);

export const updateProject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const userId = req.user?._id;
        validateReqBody(updateProjectSchema, req, next);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_PROJECT]);

        const { project } = await updateProjectService({
            workspaceId,
            projectId,
            body: req.body,
        });

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Project updated successfully",
            project,
        });
    }
);

export const deleteProject = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const projectId = req.params.projectId;
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.DELETE_PROJECT]);

        await deleteProjectService(projectId, workspaceId);

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Project deleted successfully",
        });
    }
);
export const getAllProjectsOfAWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const pageSize = Number.parseInt(req.query.pageSize as string) || 10;
        const pageNumber = Number.parseInt(req.query.pageNumber as string) || 1;

        const { projects, skip, totalCount, totalPages } =
            await getAllProjectsOfAWorkspaceService(
                workspaceId,
                pageSize,
                pageNumber
            );
        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Projects fetched successfully",
            projects,
            pagination: {
                totalCount,
                pageSize,
                pageNumber,
                totalPages,
                skip,
                limit: pageSize,
            },
        });
    }
);

export const getProjectAnalytics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.id;
        const workspaceId = req.params.workspaceId;

        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getProjectAnalyticsService(
            workspaceId,
            projectId
        );

        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Project analytics retrieved successfully",
            analytics,
        });
    }
);
