import { type Request, type Response, type NextFunction } from 'express'
import { ZodError } from 'zod';

export const errorHandlerMiddleware = (
    err: Error | ZodError,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    console.error("[    ERROR   ]: ", err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 400,
            message: "Datos inválidos o incompletos",
            errors: err.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
    }

    return res.status(500).json({
        status: 500,
        message: "Internal server error",
    });
};
