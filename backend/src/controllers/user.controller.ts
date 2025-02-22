import { Request, Response } from "express";
import catchAsync from "../middlewares/catchAsync";
import { getMeService } from "../services/user.service";
import { HTTPSTATUS } from "../config/http.config";

export const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { user } = await getMeService(userId);

    res.status(HTTPSTATUS.OK).json({
        status: "success",
        message: "User fetched successfully",
        user,
    });
});
