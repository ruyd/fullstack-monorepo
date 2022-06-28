"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./drawings/routes"));
const db_1 = __importDefault(require("../shared/db"));
const routes_2 = require("./auto/routes");
const auth_1 = require("../shared/auth");
const router = express_1.default.Router();
//Auto CRUD Routes
db_1.default.modelManager.models.every((model) => {
    const routePrefix = `${model.name.toLowerCase()}`;
    const listing = routes_2.listHandler.bind(model);
    router.get(`/${routePrefix}`, auth_1.tokenCheck, listing);
    router.get(`/${routePrefix}/:id`, auth_1.tokenCheck, routes_2.getHandler.bind(model));
    router.post(`/${routePrefix}`, auth_1.tokenCheck, routes_2.saveHandler.bind(model));
    router.patch(`/${routePrefix}`, auth_1.tokenCheck, routes_2.saveHandler.bind(model));
    router.delete(`/${routePrefix}/:id`, auth_1.tokenCheck, routes_2.deleteHandler.bind(model));
});
router.use('/drawings', routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map