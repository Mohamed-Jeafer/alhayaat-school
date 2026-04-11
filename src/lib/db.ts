import { Pool } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('ERR_DB_NOT_CONFIGURED: DATABASE_URL environment variable is not set');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      // Azure Database for PostgreSQL requires SSL; rejectUnauthorized is
      // handled by the sslmode=require parameter in the connection string.
      ssl: process.env.DATABASE_URL.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
    });
  }
  return pool;
}

export const db = {
  query: <T = unknown>(text: string, params?: unknown[]) =>
    getPool().query<{ [K in keyof T]: T[K] }>(text, params),
};
