class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, statusCode: number = 404) {
        super(message, statusCode);
    }
}

export default AppError;
