import express, { type Router, type Request, type Response } from 'express';
import { slimeController } from '../controllers/slime.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { tokenService } from '../services/token.service.js';

const slimeRouter: Router = express.Router();

// Endpoint base de prueba
slimeRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola endpoint de Slimes!"
    });
});

// CREAR un slime (POST)
// Body: { name, color }
// Cookie: AccessToken
slimeRouter.post(
    "/",
    slimeController.createSlime.bind(slimeController),
);

// ACTUALIZAR un slime (PUT)
// Body: { slimeId, name, color }
// Cookie: AccessToken
slimeRouter.put(
    "/",
    slimeController.updateSlime.bind(slimeController)
);

// ELIMINAR un slime (DELETE)
// URL: /slime/456
// Cookie: AccessToken
slimeRouter.delete(
    "/:slimeId",
    slimeController.deleteSlime.bind(slimeController)
);

// OBTENER un slime específico por Params (GET)
// URL ejemplo: /slime/search/456
// Cookie: AccessToken
slimeRouter.get(
    "/search/:slimeId",
    slimeController.getMySlimeById.bind(slimeController)
);

// OBTENER todos los slimes de un usuario (GET)
// URL: /slime/my-slimes
// Cookie: AccessToken
slimeRouter.get(
    "/my-slimes",
    slimeController.getMySlimes.bind(slimeController)
);

export default slimeRouter;
