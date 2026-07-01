import express, { type Express } from 'express'
import "dotenv/config" // - Importar variables de entorno definidas en el archivo .env
import appRouter from './routes/router.js';

const app: Express = express();

// Aceptar body en formato JSON 
app.use(express.json());

// Rutas de la API
app.use("/", appRouter);

export default app;
