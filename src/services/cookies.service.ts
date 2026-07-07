import type { Response, Request, CookieOptions } from "express";

export class CookieService {

    /**
    * Guarda o actualiza una cookie en el navegador del cliente
    */
    async set(
        res: Response,
        name: string,
        value: string,
        options: CookieOptions = {}
    ): Promise<void> {
        // Configuración por defecto orientada a la seguridad
        const defaultOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true solo en producción (HTTPS)
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24, // 1 día por defecto
            ...options
        };

        res.cookie(name, value, defaultOptions);
    }

    /**
    * Obtiene el valor de una cookie pasándole la solicitud (req)
    */
    async get(
        req: Request,
        name: string,
        isSigned: boolean = false
    ): Promise<string | undefined> {
        // Si es una cookie firmada, se busca en signedCookies; si no, en cookies normales
        if (isSigned) {
            return req.signedCookies ? req.signedCookies[name] : undefined;
        }

        return req.cookies ? req.cookies[name] : undefined;
    }

    /**
    * Elimina una cookie del cliente
    */
    async clear(
        res: Response,
        name: string,
        options: CookieOptions = {}
    ): Promise<void> {
        // Es vital pasar el mismo path y dominio con el que se creó para que se borre con éxito
        const { maxAge, expires, ...clearOptions } = options;
        res.clearCookie(name, {
            httpOnly: true,
            sameSite: 'lax',
            ...clearOptions
        });
    }

}

export const cookieService = new CookieService();
