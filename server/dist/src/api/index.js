"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./drawings/routes"));
const router = express_1.default.Router();
router.use('/drawings', routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map