declare global {
    namespace Express {
        interface Request {
            // Propiedad para manejar las variables de auth
            auth?: {
                userId: string;
                sessionId: string;
            };
        }
    }
}

export { };
