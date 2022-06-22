import express from 'express'
import { PagingOptions } from '../../shared/types'
import { createOrUpdate, deleteIfExists, getIfExists, list } from './controller'

const router = express.Router()

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
router.post('/', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing')
  }
  const result = await createOrUpdate(req.body)
  res.json(result)
})

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
router.delete('/:id', async (req, res) => {
  const result = await deleteIfExists(req.params.id)
  res.json(result)
})

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
router.get('/:id', async (req, res) => {
  const result = await getIfExists(req.params.id)
  res.json(result)
})

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
router.get('/', async (req, res) => {
  const userId = req.query.userId as string
  const limit = Number(req.query.limit || 100)
  const offset = Number(req.query.offset || 0)
  const result = await list(userId, { limit, offset })
  res.json(result)
})

export default router
