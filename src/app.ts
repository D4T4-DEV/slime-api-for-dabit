import express, { type Express, type Request, type Response } from 'express'
import "dotenv/config" // - Importar variables de entorno definidas en el archivo .env

const app: Express = express();

// Aceptar body en formato JSON 
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: 200,
        message: "¡Hola a mi API de Slimes!"
    });
});

export default app;
