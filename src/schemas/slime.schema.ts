import { z } from 'zod';

const hexColorRegex = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/;

// Definimos el objeto auth común para reutilizar su tipo interno si es necesario
const authFields = {
  auth: z.object({
    authId: z.uuid({ message: "authId debe ser un UUID válido" }),
  }),
};

export const createSlimeSchema = z.object({
  body: z.object({
    name: z.string().min(1, "El nombre es requerido"),
    color: z.string().regex(hexColorRegex, { message: "El color debe ser un hexadecimal válido" }),
  }),
  ...authFields, // Es una extensión limpia usando el operador spread (...)
});

export const updateSlimeSchema = z.object({
  body: z.object({
    slimeId: z.uuid("slimeId debe ser un UUID válido"),
    name: z.string().min(1, "El nombre es requerido"),
    color: z.string().regex(hexColorRegex, { message: "El color debe ser un hexadecimal válido" }),
  }),
  ...authFields,
});

export const deleteSlimeSchema = z.object({
  params: z.object({
    slimeId: z.uuid("slimeId debe ser un UUID válido"),
  }),
  ...authFields,
});

export const getMySlimesSchema = z.object({
  ...authFields,
});

export const getMySlimeByIdSchema = z.object({
  params: z.object({
    slimeId: z.uuid("slimeId debe ser un UUID válido"),
  }),
  ...authFields,
});