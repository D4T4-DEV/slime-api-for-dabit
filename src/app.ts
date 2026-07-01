import express, { type Express } from 'express'
import "dotenv/config" // - Importar variables de entorno definidas en el archivo .env

const app: Express = express();

// Aceptar body en formato JSON 
app.use(express.json());

export default app;
