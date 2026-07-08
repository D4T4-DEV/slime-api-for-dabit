import { type NextFunction, type Request, type Response } from 'express'
import { authService, type AuthService } from '../services/auth.service.js';
import { cookieService, type CookieService } from '../services/cookies.service.js';
import { authContextSchema, loginSchema, registerSchema } from '../schemas/auth.schema.js';

export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
    ) { }

    // Funcion para iniciar sesion 
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            // Validamos la entrada con Zod
            const { body } = loginSchema.parse({ body: req.body });
            const { email, password } = body;

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

            const { data, ...cleanResponse } = auth;
            return res.status(cleanResponse.status).json(cleanResponse);
        } catch (error) {
            next(error);
        }
    }

    // Funcion para registrar a un usuario
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            // Validamos la entrada con Zod
            const { body } = registerSchema.parse({ body: req.body });
            const { email, password } = body;

            const register = await this.authService.register(email, password);
            return res.status(register.status).json(register);
        } catch (error) {
            next(error);
        }
    }

    // Funcion que actualiza la sesión mediante un refreshToken
    async updateSession(req: Request, res: Response, next: NextFunction) {
        try {
            // Zod valida que req.auth exista y contenga los datos correctos
            const { auth } = authContextSchema.parse({ auth: req.auth });
            const { sessionId } = auth;

            const sessionRefresh = await this.authService.refreshSession(sessionId);

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

            const { data, ...cleanResponse } = sessionRefresh;
            return res.status(cleanResponse.status).json(cleanResponse);
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            // Zod valida que req.auth exista
            const { auth } = authContextSchema.parse({ auth: req.auth });
            const { sessionId } = auth;

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
