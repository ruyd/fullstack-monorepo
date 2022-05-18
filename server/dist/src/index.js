"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const config_1 = __importDefault(require("./shared/config"));
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const db_1 = __importDefault(require("./shared/db"));
const api_1 = __importDefault(require("./api"));
const errorMiddleware_1 = require("./shared/errorMiddleware");
(() => __awaiter(void 0, void 0, void 0, function* () {
    //Initialize Models
    yield db_1.default.authenticate();
    yield db_1.default.createSchema(config_1.default.db.schema, {});
    yield db_1.default.sync();
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    //Swagger
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)({
        swaggerDefinition: config_1.default.swaggerSetup,
        apis: ['./src/**/swagger.yaml', './src/**/routes.ts'],
    })));
    //Apply API
    app.use(`/${config_1.default.version}`, api_1.default);
    //Start server
    app.get('/', (req, res) => {
        res.send('Talk Backend x');
    });
    //Errors
    app.use(errorMiddleware_1.errorHandler);
    app.use(errorMiddleware_1.errorConverter);
    app.listen(config_1.default.port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${config_1.default.port} with API Swagger at /docs`);
    });
}))();
//# sourceMappingURL=index.js.map