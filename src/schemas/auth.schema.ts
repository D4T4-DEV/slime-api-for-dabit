import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.email("El formato del correo electrónico no es válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    }),
});

export const registerSchema = z.object({
    body: z.object({
        email: z.email("El formato del correo electrónico no es válido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    }),
});

// Esquema opcional para validar la estructura interna de req.auth si usas un middleware
export const authContextSchema = z.object({
    auth: z.object({
        authId: z.uuid("authId debe ser un UUID válido"),
        sessionId: z.uuid("sessionId debe ser un UUID válido"),
    }),
});