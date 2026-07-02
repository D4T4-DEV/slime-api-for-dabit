import express, { type Express } from 'express'
import cors from "cors";
import "dotenv/config" // - Importar variables de entorno definidas en el archivo .env
import appRouter from './routes/router.js';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';

const app: Express = express();

// Aceptar body en formato JSON 
app.use(express.json());

// Habilitar CORS (por sus siglas en inglés, Cross-Origin Resource Sharing)
app.use(cors());

// Rutas de la API
app.use("/", appRouter);

// Manejador de errores de la API
app.use(errorHandlerMiddleware);

export default app;
