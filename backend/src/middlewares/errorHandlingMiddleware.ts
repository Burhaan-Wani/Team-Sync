import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import config from "../config/app.config";

interface CustomError extends Error {
    statusCode: number;
    status: "fail" | "error";
    isOperational: boolean;
}

const sendDevError = (res: Response, error: CustomError) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error,
        stack: error.stack,
    });
};

const sendProdError = (res: Response, error: CustomError) => {
    if (error.isOperational) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    } else {
        console.log("ERROR OCCURRED", error);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            status: error.status,
            message: "Something went wrong.",
        });
    }
};

const errorHandlingMiddleware: ErrorRequestHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    error.statusCode = error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR;
    error.status = error.status || "error";

    if (config.NODE_ENV === "development") {
        sendDevError(res, error);
    } else if (config.NODE_ENV === "production") {
        sendProdError(res, error);
    }
};

export default errorHandlingMiddleware;
