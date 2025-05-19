import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/domains/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./sqlite.db",
  },
  strict: true,
});