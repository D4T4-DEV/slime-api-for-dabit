import type { Database } from "better-sqlite3";
import db from "../database/createDatabase.js";

export interface Session {
    id: string;
    auth_id: string;
    revoked: boolean;
    expires_at: string;
}

export class SessionModel {

    constructor(private readonly db: Database) { }

    async getSessionById(session_id: string): Promise<Session | null> {
        try {
            // Preparamos la sentencia SQL
            const stmt = this.db.prepare('SELECT id, auth_id, revoked, expires_at FROM sessions WHERE id = ?');

            // Ejecutamos usando .get() ya que solo buscamos una fila.
            // Al castearlo como <Session | undefined>, TypeScript sabrá qué estructura tiene.
            const result = stmt.get(session_id) as Session | undefined;

            // Si no existe, devolvemos null
            return result || null;
        } catch (error) {
            console.error("Error al obtener la sesion por id con better-sqlite3:", error);
            throw error;
        }
    }

    async createNewSession(data: Session): Promise<void> {
        try {
            const { id, auth_id, revoked, expires_at } = data;
            const stmt = this.db.prepare('INSERT INTO sessions (id, auth_id, revoked, expires_at) VALUES (?, ?, ?, ?)');

            //  Ejecutamos con .run() pasando los parámetros en el mismo orden que el SQL
            stmt.run(id, auth_id, revoked ? "1" : "0", expires_at);

        } catch (error) {
            console.error("Error al crear un registro de sesion:", error);
            throw error;
        }
    }

    async expiredSession(session_id: string): Promise<void> {
        try {
            const stmt = this.db.prepare('UPDATE sessions SET revoked = true WHERE id = ?');

            //  Ejecutamos con .run() pasando los parámetros en el mismo orden que el SQL
            stmt.run(session_id);

        } catch (error) {
            console.error("Error al expirar un registro de sesion:", error);
            throw error;
        }
    }

    async refreshSession(session_id: string, expires_at: string): Promise<void> {
        try {
            const stmt = this.db.prepare('UPDATE sessions SET expires_at = ? WHERE id = ?');

            //  Ejecutamos con .run() pasando los parámetros en el mismo orden que el SQL
            stmt.run(expires_at, session_id);

        } catch (error) {
            console.error("Error al refrescar un registro de sesion:", error);
            throw error;
        }
    }
}

export const sessionModel = new SessionModel(db);
