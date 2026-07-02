import { type Request, type Response, type NextFunction } from 'express'

export const errorHandlerMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.error("[    ERROR   ]: ", err);
    return res.status(500).json({
        status: 500,
        message: "Internal server error",
    });
};
