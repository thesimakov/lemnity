"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("prisma/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
const fs_1 = require("fs");
// Определяем путь к корню проекта
// Если запускается из packages/database, то process.cwd() будет packages/database
// Если запускается из корня, то process.cwd() будет корень проекта
const cwd = process.cwd();
const rootDir = cwd.endsWith('packages/database') ? (0, path_1.resolve)(cwd, '../..') : cwd;
// Определяем путь к файлу окружения
const envFileName = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod';
const envFile = (0, path_1.resolve)(rootDir, envFileName);
// Загружаем переменные окружения, если файл существует
if ((0, fs_1.existsSync)(envFile)) {
    const result = (0, dotenv_1.config)({ path: envFile });
    if (result.error) {
        console.warn(`Warning: Failed to load ${envFile}:`, result.error);
    }
}
else {
    // Fallback на .env если .env.prod/.env.dev не существует
    const fallbackEnv = (0, path_1.resolve)(rootDir, '.env');
    if ((0, fs_1.existsSync)(fallbackEnv)) {
        const result = (0, dotenv_1.config)({ path: fallbackEnv });
        if (result.error) {
            console.warn(`Warning: Failed to load ${fallbackEnv}:`, result.error);
        }
    }
    else {
        console.warn(`Warning: No .env file found. Tried: ${envFile} and ${fallbackEnv}`);
    }
}
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema/",
    migrations: {
        path: "prisma/schema/migrations",
    },
    datasource: {
        url: (0, config_1.env)("DATABASE_URL"),
    },
});
