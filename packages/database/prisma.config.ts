import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://user:password@localhost:5432/db";

export default defineConfig({
  schema: "prisma/schema/",
  migrations: {
    path: "prisma/schema/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
