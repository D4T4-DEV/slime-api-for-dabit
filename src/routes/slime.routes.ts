import express, { type Router, type Request, type Response } from 'express';
import { slimeController } from '../controllers/slime.controller.js';

const slimeRouter: Router = express.Router();

// Endpoint base de prueba
slimeRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola endpoint de Slimes!"
    });
});

// CREAR un slime (POST)
// Body: { name, color, ownerId }
slimeRouter.post("/", slimeController.createSlime.bind(slimeController));

// ACTUALIZAR un slime (PUT)
// Body: { slimeId, name, color, ownerId }
slimeRouter.put("/", slimeController.updateSlime.bind(slimeController));

// ELIMINAR un slime (DELETE)
// URL: /slime/?ownerId=123&slimeId=456
slimeRouter.delete("/", slimeController.deleteSlime.bind(slimeController));

// OBTENER un slime específico por Query Params (GET)
// URL ejemplo: /slime/search?ownerId=123&slimeId=456
slimeRouter.get("/search", slimeController.getMySlimeById.bind(slimeController));

// OBTENER todos los slimes de un usuario (GET)
// URL: /slime/id-del-dueno
slimeRouter.get("/:ownerId", slimeController.getMySlimes.bind(slimeController));

export default slimeRouter;
