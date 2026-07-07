import { compare, genSalt, hash } from "bcrypt";

export class HashService {
    constructor(
        private readonly saltRounds: number
    ) { }

    /**
    * Encripta un texto plano (contraseña) usando bcrypt.
    */
    async hash(plainText: string): Promise<string> {
        // Genera el salt usando los rounds configurados
        const salt = await genSalt(this.saltRounds);
        // Retorna el texto encriptado
        return hash(plainText, salt);
    }

    /**
    * Compara un texto plano con un hash existente para ver si coinciden.
    */
    async compare(plainText: string, hash: string): Promise<boolean> {
        return compare(plainText, hash);
    }
}

export const hashService = new HashService(10);
