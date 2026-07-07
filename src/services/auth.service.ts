import { EXPIRATION_ACCESS_TOKEN, EXPIRATION_REFRESH_TOKEN } from "../core/constants/jwt.constants.js";
import { authModel, type AuthModel } from "../models/auth.model.js";
import { sessionModel, type SessionModel } from "../models/session.model.js";
import { hashService, type HashService } from "./hash.service.js";
import { idService, type IdService } from "./id.service.js";
import { tokenService, type TokenService } from "./token.service.js";

interface ResponseService<T = void> {
    status: number;
    message: string;
    data?: T;
}

export interface LoginResponse {
    accessToken: string;
    expirationAccessToken: Date;
    refreshToken: string;
    expirationRefreshToken: Date;
}

export interface RefreshSessionResponse {
    accessToken: string;
    expirationAccessToken: Date;
    refreshToken: string;
    expirationRefreshToken: Date;
}

export class AuthService {
    constructor(
        private readonly _tokenService: TokenService,
        private readonly _hashService: HashService,
        private readonly _idService: IdService,
        private readonly _authModel: AuthModel,
        private readonly _sessionModel: SessionModel,
    ) { }

    async login(email: string, password: string): Promise<ResponseService<LoginResponse>> {
        const SESSION_ID = await this._idService.getUUID();

        const authData = await this._authModel.getAuthByEmail(email);
        if (!authData) {
            return {
                status: 401,
                message: "Credenciales incorrectas",
            }
        }

        const isPassworCorrect = await this._hashService.compare(password, authData.password);

        if (!isPassworCorrect) {
            return {
                status: 401,
                message: "Credenciales incorrectas",
            }
        }

        // Access Token: Clonamos la fecha actual y le sumamos 2 horas
        const expirationAccessToken = new Date();
        expirationAccessToken.setHours(expirationAccessToken.getHours() + EXPIRATION_ACCESS_TOKEN);

        // Refresh Token: Clonamos la fecha actual y le sumamos 30 días
        const expirationRefreshToken = new Date();
        expirationRefreshToken.setDate(expirationRefreshToken.getDate() + EXPIRATION_REFRESH_TOKEN);

        const accessToken = await this._tokenService.generateAccessToken({
            session_id: SESSION_ID,
        },
            expirationAccessToken
        );

        const refreshToken = await this._tokenService.generateRefreshToken({
            session_id: SESSION_ID,
        },
            expirationRefreshToken
        );

        await this._sessionModel.createNewSession({
            id: SESSION_ID,
            auth_id: authData.id,
            revoked: false,
            expires_at: expirationRefreshToken.toISOString(),
        });

        return {
            status: 200,
            message: "Bienvenido!",
            data: {
                accessToken: accessToken,
                expirationAccessToken: expirationAccessToken,
                refreshToken: refreshToken,
                expirationRefreshToken: expirationRefreshToken,
            }
        }
    }

    async register(email: string, password: string): Promise<ResponseService> {
        const AUTH_ID = await this._idService.getUUID();

        const authData = await this._authModel.getAuthByEmail(email);
        if (authData) {
            return {
                status: 409,
                message: "El correo electrónico ya está registrado.",
            }
        }

        const passwordHash = await this._hashService.hash(password);

        await this._authModel.createNewAuth(AUTH_ID, email, passwordHash);

        return {
            status: 200,
            message: "Cuenta registrada!"
        }
    }

    async refreshSession(sessionId: string): Promise<ResponseService<RefreshSessionResponse>> {
        const ahora = new Date();
        const session = await this._sessionModel.getSessionById(sessionId);

        if (!session) {
            return {
                status: 409,
                message: "La sesion no existe"
            }
        }

        if (session.revoked) {
            return {
                status: 401,
                message: "La sesión ha expirado. Por favor, inicia sesión nuevamente."
            }
        }

        const sessionExpiration = new Date(session.expires_at);
        if (ahora > sessionExpiration) {
            await this._sessionModel.expiredSession(sessionId);
            return {
                status: 401,
                message: "La sesión ha expirado. Por favor, inicia sesión nuevamente."
            }
        }

        // Access Token: Clonamos la fecha actual y le sumamos 2 horas
        const expirationAccessToken = new Date();
        expirationAccessToken.setHours(expirationAccessToken.getHours() + EXPIRATION_ACCESS_TOKEN);

        // Refresh Token: Clonamos la fecha actual y le sumamos 30 días
        const expirationRefreshToken = new Date();
        expirationRefreshToken.setDate(expirationRefreshToken.getDate() + EXPIRATION_REFRESH_TOKEN);

        const accessToken = await this._tokenService.generateAccessToken({
            session_id: session.id,
        },
            expirationAccessToken
        );

        const refreshToken = await this._tokenService.generateRefreshToken({
            session_id: session.id,
        },
            expirationRefreshToken
        );

        await this._sessionModel.refreshSession(sessionId, expirationRefreshToken.toISOString());

        return {
            status: 200,
            message: "Sesion refrescada!",
            data: {
                accessToken: accessToken,
                expirationAccessToken: expirationAccessToken,
                refreshToken: refreshToken,
                expirationRefreshToken: expirationRefreshToken,
            }
        }

    }

    async logout(sessionId: string): Promise<ResponseService> {
        await this._sessionModel.expiredSession(sessionId);
        return {
            status: 200,
            message: "Sesion cerrada, hasta luego!",
        }
    }
}

export const authService = new AuthService(
    tokenService,
    hashService,
    idService,
    authModel,
    sessionModel,
);
