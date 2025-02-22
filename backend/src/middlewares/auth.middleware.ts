import { NextFunction, Request, Response } from "express";
import catchAsync from "./catchAsync";
import { BadRequestError } from "../utils/AppError";

export const isAuthenticated = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            return next(
                new BadRequestError("User not found. Please login first", 401)
            );
        }
    }
);
