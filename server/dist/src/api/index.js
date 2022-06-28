"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../shared/db"));
const routes_1 = require("./_auto/routes");
const models_1 = require("./drawings/models");
const routes_2 = __importDefault(require("./profile/routes"));
const router = express_1.default.Router();
router.use('/profile', routes_2.default);
//Auto CRUD
const _init = [models_1.DrawingModel];
(0, routes_1.autoApiRouterInject)(db_1.default.modelManager.models, router);
exports.default = router;
//# sourceMappingURL=index.js.map