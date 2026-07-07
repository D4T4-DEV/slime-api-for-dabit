import { type Request, type Response, type NextFunction } from 'express'
import type { TokenService } from '../services/token.service.js';

export const authMiddleware = (
    tokenService: TokenService,
    isRefreshToken: boolean = false,
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token: string | undefined;

        if (isRefreshToken) {
            token = req.cookies['auth_refresh_token'];
        } else {
            token = req.cookies['auth_access_token'];
        }

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: isRefreshToken
                    ? "Sesión ausente. Por favor, inicia sesión."
                    : "Acceso denegado. Token no proporcionado."
            });
        }
        
        // Verificar el token
        const payload = await tokenService.verifyToken(isRefreshToken, token);

        if (!payload) {
            return res.status(403).json({
                status: 403,
                message: "Token no válido o caducado"
            });
        }

        // Adjuntar el payload al objeto request para uso posterior
        req.auth = {
            userId: payload.authId,
            sessionId: payload.sessionId,
        };

        next();
    };
};
