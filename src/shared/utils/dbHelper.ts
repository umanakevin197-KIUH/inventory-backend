import { db } from "../../Infrastructure/database/initializeDatabase";

/**
 * Ejecuta una consulta con reintentos automáticos
 * Si Turso falla, reintenta hasta 3 veces
 */
export async function executeWithRetry(
    sql: string,
    args: any[] = [],
    retries: number = 3
): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await db.execute({ sql, args });
            return result;
        } catch (error: any) {
            const isLastAttempt = i === retries - 1;
            
            if (isLastAttempt) {
                console.error(`❌ Query falló después de ${retries} intentos`);
                throw error;
            }
            
            console.warn(`⚠️ Reintento ${i + 1}/${retries}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}