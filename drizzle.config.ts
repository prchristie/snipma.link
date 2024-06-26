import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
    ssl: true,
  },
  tablesFilter: ["snipma.link_*"],
} satisfies Config;
