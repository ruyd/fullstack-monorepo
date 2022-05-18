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
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /drawings:
 *   post:
 *     tags:
 *       - drawings
 *     summary: Create or update record
 *     requestBody:
 *       description: Record details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Drawing'
 *     responses:
 *       200:
 *         description: object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Drawing'
 */
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return res.status(400).send('Request body is missing');
    }
    const result = yield (0, controller_1.createOrUpdate)(req.body);
    res.json(result);
}));
/**
 * @swagger
 * /drawings/{id}:
 *   delete:
 *     tags:
 *       - drawings
 *     summary: Delete record
 *     parameters:
 *      - name: id
 *        in: path
 *        type: string
 *     responses:
 *       200:
 *         description: object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Drawing'
 */
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, controller_1.deleteIfExists)(req.params.id);
    res.json(result);
}));
/**
 * @swagger
 * /drawings/{id}:
 *   get:
 *     tags:
 *       - drawings
 *     summary: Get record
 *     parameters:
 *      - name: id
 *        in: path
 *        type: string
 *     responses:
 *       200:
 *         description: object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Drawing'
 */
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, controller_1.getIfExists)(req.params.id);
    res.json(result);
}));
/**
 * @swagger
 * /drawings:
 *   get:
 *     tags:
 *       - drawings
 *     summary: Get list
 *     parameters:
 *       - name: userId
 *         in: query
 *         type: string
 *         required: true
 *       - name: limit
 *         in: query
 *         type: integer
 *       - name: offset
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         description: array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               $ref: '#/components/schemas/Drawing'
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    const limit = Number(req.query.limit || 100);
    const offset = Number(req.query.offset || 0);
    const result = yield (0, controller_1.list)(userId, { limit, offset });
    res.json(result);
}));
exports.default = router;
//# sourceMappingURL=routes.js.map