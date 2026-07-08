declare global {
    namespace Express {
        interface Request {
            // Propiedad para manejar las variables de auth
            auth?: {
                authId: string;
                sessionId: string;
            };
        }
    }
}

export { };
