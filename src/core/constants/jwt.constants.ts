export const EXPIRATION_ACCESS_TOKEN = 2; // 2 horas
export const EXPIRATION_REFRESH_TOKEN = 30; // 30 dias

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || "";
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || "";
