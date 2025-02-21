import { Request, Response, NextFunction } from "express";

type AsyncControllerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

type asyncHandlerType = (
    req: Request,
    res: Response,
    next: NextFunction
) => void;

const catchAsync =
    (fn: AsyncControllerType): asyncHandlerType =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default catchAsync;
