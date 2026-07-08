import { type NextFunction, type Request, type Response } from 'express'
import { authService, type AuthService } from '../services/auth.service.js';
import { cookieService, type CookieService } from '../services/cookies.service.js';

export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
    ) { }

    // Funcion para iniciar sesion 
    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const auth = await this.authService.login(email, password);
            if (auth.status !== 200 || !auth.data) {
                return res.status(auth.status).json({
                    status: auth.status,
                    message: auth.message
                });
            }

            const authData = auth.data;

            await this.cookieService.set(res, 'auth_access_token', authData.accessToken, {
                expires: authData.expirationAccessToken,
            });

            await this.cookieService.set(res, 'auth_refresh_token', authData.refreshToken, {
                expires: authData.expirationRefreshToken,
            });

            // Limpieza: Extraemos 'data' y guardamos el resto en 'cleanResponse'
            const { data, ...cleanResponse } = auth;

            // Respondemos solo con status y message (los tokens ya no están aquí)
            return res.status(cleanResponse.status).json(cleanResponse);
        } catch (error) {
            next(error);
        }
    }

    // Funcion para registrar a un usuario
    async register(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;
        try {
            const register = await this.authService.register(email, password);
            return res.status(register.status).json(register);
        } catch (error) {
            next(error);
        }
    }

    // Funcion que actualiza la sesión mediante un refreshToken
    async updateSession(req: Request, res: Response, next: NextFunction) {
        const authData = req.auth;
        try {
            if (!authData) {
                return res.status(403).json({
                    status: 403,
                    message: "Los datos de auntenticacion no fueron enviados"
                });
            }

            const sessionRefresh = await this.authService.refreshSession(authData.sessionId);

            if (sessionRefresh.status !== 200 || !sessionRefresh.data) {
                return res.status(sessionRefresh.status).json({
                    status: sessionRefresh.status,
                    message: sessionRefresh.message
                });
            }

            const authnewData = sessionRefresh.data;

            await this.cookieService.set(res, 'auth_access_token', authnewData.accessToken, {
                expires: authnewData.expirationAccessToken,
            });

            await this.cookieService.set(res, 'auth_refresh_token', authnewData.refreshToken, {
                expires: authnewData.expirationRefreshToken,
            });

            // Limpieza: Extraemos 'data' y guardamos el resto en 'cleanResponse'
            const { data, ...cleanResponse } = sessionRefresh;

            return res.status(cleanResponse.status).json(cleanResponse);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        const authData = req.auth;
        try {
            if (!authData) {
                return res.status(403).json({
                    status: 403,
                    message: "Los datos de auntenticacio no fueron enviados"
                });
            }

            const { sessionId } = authData;

            const sessionRefresh = await this.authService.logout(sessionId);

            await this.cookieService.clear(res, 'auth_refresh_token');
            await this.cookieService.clear(res, 'auth_access_token');

            return res.status(sessionRefresh.status).json(sessionRefresh);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController(authService, cookieService);
