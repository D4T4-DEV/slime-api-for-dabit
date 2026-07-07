import type { Database } from "better-sqlite3";
import db from "../database/createDatabase.js";

export interface Auth {
    id: string;
    email: string;
    password: string;
}

export class AuthModel {

    constructor(private readonly db: Database) { }

    async getAuthByEmail(email: string): Promise<Auth | null> {
        try {
            // Preparamos la sentencia SQL
            const stmt = this.db.prepare('SELECT id, email, password FROM auth WHERE email = ?');

            // Ejecutamos usando .get() ya que solo buscamos una fila.
            // Al castearlo como <Auth | undefined>, TypeScript sabrá qué estructura tiene.
            const result = stmt.get(email) as Auth | undefined;

            // Si no existe, devolvemos null
            return result || null;
        } catch (error) {
            console.error("Error al obtener el usuario por email con better-sqlite3:", error);
            throw error;
        }
    }

    async getAuthByAuthId(id: string): Promise<Auth | null> {
        try {
            // Preparamos la sentencia SQL
            const stmt = this.db.prepare('SELECT id, email, password FROM auth WHERE id = ?');

            // Ejecutamos usando .get() ya que solo buscamos una fila.
            // Al castearlo como <Auth | undefined>, TypeScript sabrá qué estructura tiene.
            const result = stmt.get(id) as Auth | undefined;

            // Si no existe, devolvemos null
            return result || null;
        } catch (error) {
            console.error("Error al obtener el usuario por Auth id con better-sqlite3:", error);
            throw error;
        }
    }

    async createNewAuth(id: string, email: string, passwordHash: string): Promise<void> {
        try {
            const stmt = this.db.prepare('INSERT INTO auth (id, email, password) VALUES (?, ?, ?)');

            //  Ejecutamos con .run() pasando los parámetros en el mismo orden que el SQL
            stmt.run(id, email, passwordHash);

        } catch (error) {
            console.error("Error al crear el nuevo registro de autenticación:", error);
            throw error;
        }
    }

}

export const authModel = new AuthModel(db);
