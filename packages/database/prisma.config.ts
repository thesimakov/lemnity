import 'dotenv/config'
import { defineConfig, env } from "prisma/config";
import { config } from 'dotenv'

const envFile = process.env.NODE_ENV === 'development' ? '../../.env.dev' : '../../.env.prod'
config({ path: envFile })

export default defineConfig({
  schema: "prisma/schema/",
  migrations: {
    path: "prisma/schema/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
