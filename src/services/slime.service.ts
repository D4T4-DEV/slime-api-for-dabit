import { slimeModel, type SlimeModel } from "../models/slime.model.js";
import { idService, type IdService } from "./id.service.js";

export class SlimeService {
    constructor(
        private readonly _idService: IdService,
        private readonly _slimeModel: SlimeModel
    ) { }

    // Funcion que crea un slime
    async createSlime(
        name: string,
        color: string,
        ownerId: string
    ) {
        const SLIME_ID = await this._idService.getUUID();
        return await this._slimeModel.save({
            id: SLIME_ID,
            ownerId: ownerId,
            name: name,
            color: color,
        });
    }

    // Funcion que actualiza un slime
    async updateSlime(
        slimeId: string,
        ownerId: string,
        name: string,
        color: string,
    ) {
        return await this._slimeModel.update(slimeId, ownerId, {
            name: name,
            color: color,
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
        return await this._slimeModel.getById(slimeId, ownerId);
    }
}

export const slimeService = new SlimeService(
    idService,
    slimeModel
);
