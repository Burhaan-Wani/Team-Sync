import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import config from "../config/app.config";
import catchAsync from "../middlewares/catchAsync";
import passport from "passport";
import AppError, { BadRequestError } from "../utils/AppError";
import { HTTPSTATUS } from "../config/http.config";
import { registerSchema } from "../validations/auth.validations";
import { validateReqBody } from "../utils/ZodError";
import { registerUserService } from "../services/auth.service";

export const googleLoginController = catchAsync(
    async (req: Request, res: Response) => {
        const currentWorkspace = req.user?.currentWorkspace;

        if (!currentWorkspace) {
            return res.redirect(
                `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }
        return res.redirect(
            `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
        );
    }
);

export const registerController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        validateReqBody(registerSchema, req, next);
        await registerUserService(req.body);

        return res.status(HTTPSTATUS.CREATED).json({
            status: "success",
            message: "User created successfully",
        });
    }
);

export const loginController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "local",
            (
                err: Error | null,
                user: Express.User | false,
                info: { message: string } | undefined
            ) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(
                        new AppError(
                            info?.message || "Invalid email or password",
                            401
                        )
                    );
                }
                req.logIn(user, err => {
                    if (err) {
                        return next(err);
                    }
                    res.status(HTTPSTATUS.OK).json({
                        status: "success",
                        message: "Logged in successfully",
                        user,
                    });
                });
            }
        )(req, res, next);
    }
);

export const logoutController = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        req.logOut(err => {
            if (err) return next(new BadRequestError("Failed to logout"));
        });
        req.session = null;
        return res
            .status(HTTPSTATUS.OK)
            .json({ status: "success", message: "Logged out successfully" });
    }
);
