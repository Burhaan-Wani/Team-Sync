import { NextFunction, Request, Response } from "express";
import catchAsync from "../middlewares/catchAsync";
import { validateReqBody } from "../utils/ZodError";
import {
    changeRoleSchema,
    createWorkspaceSchema,
    updateWorkspaceSchema,
} from "../validations/workspace.validation";
import {
    changeMemberRoleInWorkspaceService,
    createWorkspaceService,
    deleteWorkspaceService,
    getMemberRoleInWorkspace,
    getWorkspaceAnalyticsService,
    getWorkspaceMembersService,
    getWorkspaceService,
    getWorkspacesWhereUserIsMemberService,
    updateWorkspaceService,
} from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";
import { Permissions } from "../enums/roleEnum";
import { roleGuard } from "../utils/roleGuard";
import { BadRequestError } from "../utils/AppError";

export const createWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;
        validateReqBody(createWorkspaceSchema, req, next);

        const { workspace } = await createWorkspaceService({
            userId,
            body: req.body,
        });

        res.status(HTTPSTATUS.CREATED).json({
            status: "success",
            message: "Workspace created successfully",
            workspace,
        });
    }
);

export const updateWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        validateReqBody(updateWorkspaceSchema, req, next);
        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_WORKSPACE]);

        const { workspace } = await updateWorkspaceService(
            workspaceId,
            req.body
        );

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspace updated successfully",
            workspace,
        });
    }
);

export const deleteWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.DELETE_WORKSPACE]);

        await deleteWorkspaceService(workspaceId, userId);

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspace deleted successfully",
        });
    }
);

export const getWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        if (!workspaceId) {
            return next(new BadRequestError("Workspace ID is required"));
        }
        // check whether the user and workspace exists or not
        await getMemberRoleInWorkspace(userId, workspaceId);
        const { workspace } = await getWorkspaceService(workspaceId);

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspace fetched successfully",
            workspace,
        });
    }
);

export const changeMemberRoleInWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        validateReqBody(changeRoleSchema, req, next);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

        const { member } = await changeMemberRoleInWorkspaceService(
            workspaceId,
            req.body
        );

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Role updated successfully",
            member,
        });
    }
);

export const getWorkspaceMembers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { members, roles } = await getWorkspaceMembersService(
            workspaceId
        );

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspace members retrieved successfully",
            members,
            roles,
        });
    }
);

export const getWorkspacesWhereUserIsMember = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?._id;

        const { workspaces } = await getWorkspacesWhereUserIsMemberService(
            userId
        );

        res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspaces fetched successfully",
            workspaces,
        });
    }
);

export const getWorkspaceAnalytics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const workspaceId = req.params.workspaceId;
        const userId = req.user?._id;
        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getWorkspaceAnalyticsService(workspaceId);

        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Workspace analytics retrieved successfully",
            analytics,
        });
    }
);
