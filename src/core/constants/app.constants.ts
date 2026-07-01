
// Variable que determina el puerto del servidor, 
// si no se configuro en el .env tomara el 3000 
export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 3000;
