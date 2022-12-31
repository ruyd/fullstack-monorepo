import express from 'express'
import { gallery, start, getClientConfig } from './controller'

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
router.get('/config', getClientConfig)

/**
 * @swagger
 * /start:
 *  post:
 */
router.post('/start', start)

export default router
