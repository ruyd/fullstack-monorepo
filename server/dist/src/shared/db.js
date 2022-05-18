"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonOptions = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
exports.commonOptions = {
    timestamps: true,
    underscored: true,
};
const sequelize = new sequelize_1.Sequelize(config_1.default.db.url, {
    ssl: config_1.default.db.ssl,
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map