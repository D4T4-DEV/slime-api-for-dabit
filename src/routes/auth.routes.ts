import express, { type Router, type Request, type Response } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { tokenService } from '../services/token.service.js';

const authRouter: Router = express.Router();

authRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola endpoint de Autenticación"
    });
});

// Crea un nuevo registro
// Body: { email, password }
authRouter.post("/register", authController.register.bind(authController));

// Genera una sesión por medio de tokens
// Body: { email, password }
authRouter.post("/login", authController.login.bind(authController));

// Refresca una sesión por medio de tokens
// Cookies: { refreshToken } -> Devuelve el payload del token
authRouter.put("/refresh",
    authMiddleware(tokenService, true),
    authController.updateSession.bind(authController)
);

// Cierra una sesión por medio de tokens
// Cookies: { refreshToken } -> Devuelve el payload del token
authRouter.post("/logout",
    authMiddleware(tokenService, true),
    authController.logout.bind(authController)
);

export default authRouter;
