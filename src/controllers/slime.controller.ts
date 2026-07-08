import { type NextFunction, type Request, type Response } from 'express'
import { slimeService, type SlimeService } from '../services/slime.service.js';
import { createSlimeSchema, deleteSlimeSchema, getMySlimeByIdSchema, getMySlimesSchema, updateSlimeSchema } from '../schemas/slime.schema.js';

export class SlimeController {

    constructor(private readonly _slimeService: SlimeService) { }

    // Funcion que crea un slime
    async createSlime(req: Request, res: Response, next: NextFunction) {
        try {
            // Validamos req completo (body y auth)
            const { body, auth } = createSlimeSchema.parse({ body: req.body, auth: req.auth });
            const { name, color } = body;
            const { authId } = auth;

            const newSlime = await this._slimeService.createSlime(name, color, authId);

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
        try {
            const { body, auth } = updateSlimeSchema.parse({ body: req.body, auth: req.auth });
            const { slimeId, name, color } = body;
            const { authId } = auth;

            // Ya no necesitas castear con String(), Zod garantiza que son strings viles y puros
            const updatedSlime = await this._slimeService.updateSlime(slimeId, authId, name, color);

            return res.status(200).json({
                status: 200,
                message: "Devolviendo los datos actualizados del slime",
                data: updatedSlime
            });
        } catch (error) {
            next(error);
        }
    }

    // Funcion que elimina un slime
    async deleteSlime(req: Request, res: Response, next: NextFunction) {
        try {
            const { params, auth } = deleteSlimeSchema.parse({ params: req.params, auth: req.auth });
            const { slimeId } = params;
            const { authId } = auth;

            await this._slimeService.deleteSlime(slimeId, authId);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimes(req: Request, res: Response, next: NextFunction) {
        try {
            const { auth } = getMySlimesSchema.parse({ auth: req.auth });
            const { authId } = auth;

            const slimes = await this._slimeService.getMySlimes(authId);

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
        try {
            const { params, auth } = getMySlimeByIdSchema.parse({ params: req.params, auth: req.auth });
            const { slimeId } = params;
            const { authId } = auth;

            const slime = await this._slimeService.getMySlimeById(slimeId, authId);

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
