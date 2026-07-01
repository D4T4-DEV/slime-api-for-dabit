import express, { type Router, type Request, type Response } from 'express'

const appRouter: Router = express.Router();

appRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola a mi API de Slimes!"
    });
});

appRouter.get("/slime", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola endpoint de Slimes"
    });
});

appRouter.get("/auth", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola endpoint de Autenticación"
    });
});


export default appRouter;