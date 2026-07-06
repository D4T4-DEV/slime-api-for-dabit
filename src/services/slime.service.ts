import { slimeModel, type SlimeModel } from "../models/slime.model.js";

export class SlimeService {
    constructor(private readonly _slimeModel: SlimeModel) { }

    // Funcion que crea un slime
    async createSlime(
        name: string,
        color: string,
        ownerId: string
    ) {
        return await this._slimeModel.saveSlime({
            name,
            color,
            ownerId
        });
    }

    // Funcion que actualiza un slime
    async updateSlime(
        slimeId: string,
        name: string,
        color: string,
        ownerId: string
    ) {
        return await this._slimeModel.update(slimeId, {
            name,
            color,
            ownerId,
        });
    }

    // Funcion que elimina un slime
    async deleteSlime(slimeId: string, ownerId: string) {
        return await this._slimeModel.delete(slimeId, ownerId);
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimes(ownerId: string) {
        return await this._slimeModel.getByOwner(ownerId);
    }

    // Funcion que obtiene los slimes registrados por un usuario
    async getMySlimeById(slimeId: string, ownerId: string) {
        return await this._slimeModel.getBySlimeId(slimeId, ownerId);
    }
}

export const slimeService = new SlimeService(slimeModel);
