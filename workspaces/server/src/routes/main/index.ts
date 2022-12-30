import express from 'express'
import { EnrichedRequest } from '../../shared/types'
import { getClientConfig } from '../../shared/config'
import { gallery, start } from './controller'

const router = express.Router()

/**
 * @swagger
 * /gallery:
 *  get:
 */
router.get(['/gallery', '/gallery/:userId'], gallery)

/**
 * @swagger
 * /config:
 *  get:
 */
router.get('/config', async (_req, res) => {
  const req = _req as EnrichedRequest
  res.json(getClientConfig(req.auth))
})

/**
 * @swagger
 * /start:
 *  post:
 */
router.post('/start', start)

export default router
