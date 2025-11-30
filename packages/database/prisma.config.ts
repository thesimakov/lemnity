import 'dotenv/config'
import { defineConfig, env } from "prisma/config";
import { config } from 'dotenv'

config({ path: "../../.env" })

export default defineConfig({
  schema: "prisma/schema/",
  migrations: {
    path: "prisma/schema/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
