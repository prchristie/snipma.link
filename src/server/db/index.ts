import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import fs from "fs";
import { Pool } from "pg";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    // Please re-download this certificate at least monthly to avoid expiry
    ca: env.CA_CERT,
  },
});

if (env.NODE_ENV !== "production") globalForDb.pool = pool;

export const db = drizzle(pool, { schema });
