import express from 'express'
import { gallery, sendClientConfigSettings, start } from './controller'

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
router.get('/config', sendClientConfigSettings)

/**
 * @swagger
 * /start:
 *  post:
 */
router.post('/start', start)

export default router
