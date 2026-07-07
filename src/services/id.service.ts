export class IdService {
    async getUUID() {
        return crypto.randomUUID();
    }
}

export const idService = new IdService();
