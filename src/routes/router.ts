import express, { type Router, type Request, type Response } from 'express'
import slimeRouter from './slime.routes.js';
import authRouter from './auth.routes.js';
import { tokenService } from '../services/token.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const appRouter: Router = express.Router();

appRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola a mi API de Slimes!"
    });
});

// Ruta para los slimes
appRouter.use(
    "/slime",
    authMiddleware(tokenService, false),
    slimeRouter
);

// Ruta para la autenticacion
appRouter.use(
    "/auth",
    authRouter
);


export default appRouter;