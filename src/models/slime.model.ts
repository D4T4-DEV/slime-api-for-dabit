export interface Slime {
    id: string;
    ownerId: string;
    name: string;
    color: string;
}

export class SlimeModel {
    private Slimes: Slime[] = [];

    async saveSlime(data: Omit<Slime, 'id'> & { id?: string }): Promise<Slime> {
        const newSlime: Slime = {
            id: data.id || crypto.randomUUID(),
            ownerId: data.ownerId,
            name: data.name,
            color: data.color,
        };

        this.Slimes.push(newSlime);
        return newSlime;
    }

    // Usamos Partial<Slime> pero garantizamos el retorno de un Slime completo
    async update(id: string, data: Partial<Slime>): Promise<Slime | null> {
        const slimeIndex = this.Slimes.findIndex(slime => slime.id === id);

        if (slimeIndex === -1) {
            return null;
        }

        const currentSlime = this.Slimes[slimeIndex];

        if (!currentSlime) return null;

        const updatedSlime: Slime = {
            ...currentSlime,
            ...data,
            id: currentSlime.id
        };

        this.Slimes[slimeIndex] = updatedSlime;

        return updatedSlime;
    }

    async delete(id: string, ownerId: string): Promise<boolean> {
        // 1. Buscar si el Slime existe en el array
        const slimeIndex = this.Slimes.findIndex(slime => slime.id === id);

        // 2. IDEMPOTENCIA: Si el Slime no existe, terminamos con éxito (return temprano).
        // No lanzamos error, porque el objetivo final ya se cumplió: el Slime NO está en el sistema.
        if (slimeIndex === -1) {
            return false;
        }

        const currentSlime = this.Slimes[slimeIndex];

        if (!currentSlime) {
            return false;
        }

        // 3. Validación de Autorización
        // Si existe, pero NO le pertenece al dueño que lo solicita, bloqueamos la acción.
        if (currentSlime.ownerId !== ownerId) {
            throw new Error("No tienes permisos para eliminar este Slime.");
        }

        // 4. Eliminación
        // Removemos el Slime del array en memoria
        this.Slimes.splice(slimeIndex, 1);

        return true;
    }

    async getByOwner(ownerId: string): Promise<Slime[]> {
        return this.Slimes.filter(slime => slime.ownerId === ownerId);
    }

    async getBySlimeId(slimeId: string, ownerId: string): Promise<Slime | null> {
        // Buscamos el primer slime que coincida con el id provisto
        const slime = this.Slimes.find(slime => slime.id === slimeId);

        if (slime?.ownerId !== ownerId) {
            throw new Error("No tienes permisos para consultar este Slime.");
        }

        // Si .find() no encuentra nada, devuelve 'undefined'. 
        // Para cumplir estrictamente con la firma de la función, usamos el operador 
        // nullish coalescing (??) para retornar 'null' en su lugar.
        return slime ?? null;
    }
}

export const slimeModel = new SlimeModel();
