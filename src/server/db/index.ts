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
  conn: postgres.Sql | undefined;
};
const ssl = fs.readFileSync("./ca.crt").toString();

const conn =
  globalForDb.conn ??
  postgres(env.DATABASE_URL, {
    idle_timeout: 5000,
    ssl: {
      ca: ssl,
    },
  });

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    // Please re-download this certificate at least monthly to avoid expiry
    ca: ssl,
  },
});

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(pool, { schema });
