"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const package_json_1 = __importDefault(require("../../package.json"));
dotenv_1.default.config({});
const apiVersion = 'v1';
const config = {
    version: apiVersion,
    port: Number(process.env.PORT || 3001),
    tokenSecret: process.env.TOKEN_SECRET,
    db: {
        url: process.env.DB_URL || '',
        schema: process.env.DB_SCHEMA || 'public',
        ssl: process.env.DB_SSL === 'true',
    },
    swaggerSetup: {
        openapi: '3.0.0',
        info: {
            title: package_json_1.default.name,
            description: package_json_1.default.description,
            version: package_json_1.default.version,
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/${apiVersion}`,
                description: `localhost:${process.env.PORT}`,
            },
        ],
        basePath: '/docs',
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map