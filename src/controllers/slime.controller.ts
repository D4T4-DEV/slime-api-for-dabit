import { type NextFunction, type Request, type Response } from 'express'
import { slimeService, type SlimeService } from '../services/slime.service.js';

export class SlimeController {

    constructor(private readonly _slimeService: SlimeService) { }

    // Funcion que crea un slime
    async createSlime(req: Request, res: Response, next: NextFunction) {
        const authData = req.auth;
        const { name, color } = req.body;

        if (!name || !color || !authData) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        const { userId } = authData;

        try {
            const newSlime = await this._slimeService.createSlime(
                name,
                color,
                userId
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
        const authData = req.auth;

        const { slimeId, name, color } = req.body;

        if (!name || !color || !authData || !slimeId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        const { userId } = authData;

        try {
            // Convertimos explícitamente a String
            const updateSlime = await this._slimeService.updateSlime(
                String(slimeId),
                String(userId),
                String(name),
                String(color),
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
        const authData = req.auth;
        const { slimeId } = req.params;

        if (!slimeId || !authData) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        const { userId } = authData;

        try {
            await this._slimeService.deleteSlime(
                String(slimeId),
                String(userId)
            );
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimes(req: Request, res: Response, next: NextFunction) {
        const authData = req.auth;

        if (!authData) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        const { userId } = authData;

        try {
            const slimes = await this._slimeService.getMySlimes(String(userId));

            return res.status(200).json({
                status: 200,
                message: "Devolviendo los datos de tus slimes",
                data: slimes
            });
        } catch (error) {
            next(error);
        }
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimeById(req: Request, res: Response, next: NextFunction) {
        const authData = req.auth;
        const { slimeId } = req.params;

        if (!authData || !slimeId) {
            return res.status(400).json({ status: 400, message: "Datos incompletos" });
        }

        const { userId } = authData;

        try {
            // Convertir la query a String
            const slime = await this._slimeService.getMySlimeById(
                String(slimeId),
                String(userId)
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
