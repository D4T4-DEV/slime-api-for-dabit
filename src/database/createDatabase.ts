import Database from 'better-sqlite3';
import BetterSqlite3 from "better-sqlite3";

// Abrir la base de datos (se crea el archivo si no existe)
const db: BetterSqlite3.Database = new Database('./database.db', { verbose: console.log });
// El 'verbose' es opcional, sirve para ver en la consola qué querys se están ejecutando.

// Crear la tabla de auth si no existe
db.exec(`
    CREATE TABLE IF NOT EXISTS auth (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        auth_id TEXT,
        revoked BOOLEAN DEFAULT FALSE,
        expires_at TEXT,
        FOREIGN KEY (auth_id) REFERENCES auth(id) ON DELETE CASCADE
    )
`);


export default db;
