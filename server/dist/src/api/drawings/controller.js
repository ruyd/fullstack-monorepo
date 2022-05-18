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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIfExists = exports.createOrUpdate = exports.getIfExists = exports.list = void 0;
const errors_1 = require("../../shared/errors");
const models_1 = require("./models");
function list(userId, page = { limit: 100, offset: 0 }) {
    return __awaiter(this, void 0, void 0, function* () {
        const items = (yield models_1.DrawingModel.findAll(Object.assign({ raw: true, where: { userId } }, page)));
        return items;
    });
}
exports.list = list;
function getIfExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield models_1.DrawingModel.findByPk(id);
        if (!item) {
            throw new errors_1.HttpNotFoundError(`Record with id ${id} not found`);
        }
        return item;
    });
}
exports.getIfExists = getIfExists;
function createOrUpdate(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const [item] = yield models_1.DrawingModel.upsert(payload);
        return item.get();
    });
}
exports.createOrUpdate = createOrUpdate;
function deleteIfExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield getIfExists(id);
        yield item.destroy();
        return item.get();
    });
}
exports.deleteIfExists = deleteIfExists;
//# sourceMappingURL=controller.js.map