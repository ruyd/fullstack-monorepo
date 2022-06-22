"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./drawings/routes"));
const db_1 = __importDefault(require("../shared/db"));
const router = express_1.default.Router();
router.use('/drawings', routes_1.default);
db_1.default.modelManager.models.every((model) => {
    const routeName = model.name.toLowerCase();
    router.use(`/${routeName}`, model.routes);
});
exports.default = router;
//# sourceMappingURL=index.js.map