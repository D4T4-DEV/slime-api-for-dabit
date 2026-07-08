import type { Database } from "better-sqlite3";
import db from "../database/createDatabase.js";

export interface Slime {
    id: string;
    ownerId: string;
    name: string;
    color: string;
}

export class SlimeModel {
    constructor(private readonly db: Database) { }

    async save(data: Slime): Promise<void> {
        try {
            // Preparamos la sentencia SQL
            const stmt = this.db.prepare('INSERT INTO slimes (id, owner_id, name, color) VALUES (?, ?, ?, ?)');

            // Ejecutamos lo que hemos preparado
            stmt.run(
                data.id,
                data.ownerId,
                data.name,
                data.color
            );
        } catch (error) {
            console.error("Error al guardar un slime con better-sqlite3:", error);
            throw error;
        }
    }

    async update(slimeId: string, ownerId: string, data: Partial<Slime>): Promise<void> {
        try {

            const oldData = await this.getById(slimeId, ownerId);

            if (!oldData) {
                throw new Error('Slime does not exist');
            }

            const updatedName = data.name ?? oldData.name;
            const updatedColor = data.color ?? oldData.color;

            const stmt = this.db.prepare(
                'UPDATE slimes SET name = ?, color = ? WHERE id = ? AND owner_id = ?'
            );

            // Ejecutamos pasándolo en el orden EXACTO de los '?' en la query:
            // 1º name, 2º color, 3º slimeId, 4º ownerId
            stmt.run(
                updatedName,
                updatedColor,
                slimeId,
                ownerId
            );

            return;

        } catch (error) {
            console.error("Error al actualizar un slime con better-sqlite3:", error);
            throw error;
        }
    }

    async delete(slimeId: string, ownerId: string): Promise<boolean> {
        try {
            // Preparamos la sentencia SQL con la cláusula WHERE de seguridad
            const stmt = this.db.prepare('DELETE FROM slimes WHERE id = ? AND owner_id = ?');

            // Ejecutamos la sentencia
            const info = stmt.run(slimeId, ownerId);

            // info.changes contiene el número de filas borradas
            // Si es > 0 devuelve true (se borró), si es 0 devuelve false (no existía o no era el dueño)
            return info.changes > 0;

        } catch (error) {
            console.error("Error al eliminar un slime con better-sqlite3:", error);
            throw error;
        }
    }

    async getByOwner(ownerId: string): Promise<Slime[]> {
        try {
            // Preparamos la sentencia SQL para traer todos los registros del owner
            const stmt = this.db.prepare('SELECT id, owner_id, name, color FROM slimes WHERE owner_id = ?');

            // Usamos .all() para obtener el array de filas
            const rows = stmt.all(ownerId) as Array<{ id: string; owner_id: string; name: string; color: string }>;

            // Mapeamos las filas a la estructura de la entidad Slime
            return rows.map(row => ({
                id: row.id,
                ownerId: row.owner_id,
                name: row.name,
                color: row.color
            }));

        } catch (error) {
            console.error("Error al obtener los slimes por owner con better-sqlite3:", error);
            throw error;
        }
    }

    async getById(slimeId: string, ownerId: string): Promise<Slime | null> {
        try {
            // Preparamos la sentencia SQL
            const stmt = this.db.prepare('SELECT id, owner_id, name, color FROM slimes WHERE id = ? AND owner_id = ?');

            // Tipamos el resultado como un objeto con las columnas de la BD o undefined
            const row = stmt.get(slimeId, ownerId) as { id: string; owner_id: string; name: string; color: string } | undefined;

            // Si no hay registro, retornamos null
            if (!row) {
                return null;
            }

            // Mapeamos y retornamos la entidad Slime
            return {
                id: row.id,
                ownerId: row.owner_id,
                name: row.name,
                color: row.color
            };

        } catch (error) {
            console.error("Error al obtener un slime por id con better-sqlite3:", error);
            throw error;
        }
    }
}

export const slimeModel = new SlimeModel(db);
