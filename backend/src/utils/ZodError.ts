import { NextFunction, Request } from "express";
import { registerSchema } from "../validations/auth.validations";
import { BadRequestError } from "./AppError";
import { ZodSchema } from "zod";

export const validateReqBody = (
    schema: ZodSchema,
    req: Request,
    next: NextFunction
) => {
    const { success, error } = schema.safeParse(req.body);

    if (!success) {
        const _error = error.errors.map(err => err.message).join(". ");
        return next(new BadRequestError(_error));
    }
};
