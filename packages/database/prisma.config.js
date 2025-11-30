"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "../../.env" });
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema/",
    migrations: {
        path: "prisma/schema/migrations",
    },
    datasource: {
        url: (0, config_1.env)("DATABASE_URL"),
    },
});
