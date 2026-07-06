import { type NextFunction, type Request, type Response } from 'express'
import { slimeService, type SlimeService } from '../services/slime.service.js';

export class SlimeController {

    constructor(private readonly _slimeService: SlimeService) { }

    // Funcion que crea un slime
    async createSlime(req: Request, res: Response, next: NextFunction) {
        const { name, color, ownerId } = req.body;

        if (!name || !color || !ownerId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        try {
            const newSlime = await this._slimeService.createSlime(
                String(name),
                String(color),
                String(ownerId)
            );

            return res.status(201).json({
                status: 201,
                message: "Devolviendo los datos del slime creado",
                data: newSlime
            });
        } catch (error) {
            next(error);
        }
    }

    // Funcion que actualiza un slime
    async updateSlime(req: Request, res: Response, next: NextFunction) {
        const { slimeId, name, color, ownerId } = req.body;

        if (!name || !color || !ownerId || !slimeId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        try {
            // Convertimos explícitamente a String
            const updateSlime = await this._slimeService.updateSlime(
                String(slimeId),
                String(name),
                String(color),
                String(ownerId)
            );

            return res.status(200).json({
                status: 200,
                message: "Devolviendo los datos actualizados del slime",
                data: updateSlime
            });
        } catch (error) {
            next(error);
        }
    }

    // Funcion que elimina un slime
    async deleteSlime(req: Request, res: Response, next: NextFunction) {
        const { slimeId, ownerId } = req.query;

        if (!slimeId || !ownerId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        try {
            await this._slimeService.deleteSlime(String(slimeId), String(ownerId));
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimes(req: Request, res: Response, next: NextFunction) {
        const { ownerId } = req.params;

        if (!ownerId) {
            return res.status(400).json({ status: 400, message: "No se envió el id del dueño" });
        }

        try {
            const slimes = await this._slimeService.getMySlimes(String(ownerId));

            return res.status(200).json({
                status: 200,
                message: "Devolviendo los datos de los slimes",
                data: slimes
            });
        } catch (error) {
            next(error);
        }
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimeById(req: Request, res: Response, next: NextFunction) {
        const { ownerId, slimeId } = req.query;

        if (!ownerId || !slimeId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        try {
            // Convertir la query a String
            const slime = await this._slimeService.getMySlimeById(
                String(slimeId),
                String(ownerId)
            );

            return res.status(200).json({
                status: 200,
                message: "Devolviendo los datos del slime",
                data: slime
            });
        } catch (error) {
            next(error);
        }
    }
}

export const slimeController = new SlimeController(slimeService);
