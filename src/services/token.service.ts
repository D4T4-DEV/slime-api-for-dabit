import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../core/constants/jwt.constants.js";

export interface AuthTokenPayload extends JWTPayload {
    userId: string;
    sessionId: string;
}

export class TokenService {

    private readonly JWT_ACCESS_TOKEN_SECRET: Uint8Array;
    private readonly JWT_REFRESH_TOKEN_SECRET: Uint8Array;

    constructor(
        JWT_ACCESS_TOKEN_SECRET: string,
        JWT_REFRESH_TOKEN_SECRET: string,
    ) {
        this.JWT_ACCESS_TOKEN_SECRET = new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET);
        this.JWT_REFRESH_TOKEN_SECRET = new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET);
    }


    async generateAccessToken(payload: any, expiration: number | string | Date): Promise<string> {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiration)
            .sign(this.JWT_ACCESS_TOKEN_SECRET);

        return token;
    }

    async generateRefreshToken(payload: any, expiration: number | string | Date): Promise<string> {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(expiration)
            .sign(this.JWT_REFRESH_TOKEN_SECRET);

        return token;
    }

    async verifyToken(isRefreshToken: boolean, token: string): Promise<AuthTokenPayload | null> {
        const SECRET = isRefreshToken ? this.JWT_REFRESH_TOKEN_SECRET : this.JWT_ACCESS_TOKEN_SECRET;

        try {
            const { payload } = await jwtVerify(token, SECRET);
            return payload as AuthTokenPayload;
        } catch (error) {
            console.error(error)
            return null
        }
    }
}

export const tokenService = new TokenService(
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET
);
