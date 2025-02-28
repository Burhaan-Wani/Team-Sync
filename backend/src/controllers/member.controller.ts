import { NextFunction, Request, Response } from "express";

import catchAsync from "../middlewares/catchAsync";
import { HTTPSTATUS } from "../config/http.config";
import { NotFoundError } from "../utils/AppError";
import { joinWorkspaceByInviteService } from "../services/member.service";

export const joinWorkspace = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const inviteCode = req.params.inviteCode;
        const userId = req.user?._id;
        if (!inviteCode) {
            return next(new NotFoundError("InviteCode not found"));
        }
        const { workspaceId, role } = await joinWorkspaceByInviteService(
            userId,
            inviteCode
        );

        return res.status(HTTPSTATUS.OK).json({
            status: "success",
            message: "Successfully joined the workspace",
            workspaceId,
            role,
        });
    }
);
