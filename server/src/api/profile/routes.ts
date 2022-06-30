import express from 'express'
import { request } from 'http'
import { createToken } from '../../shared/auth'
import config from '../../shared/config'
import { createOrUpdate } from '../_auto/controller'
import { UserModel } from './models'

const router = express.Router()

/**
 * @swagger
 * /profile/login:
 *   post:
 *     tags:
 *       - profile
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body
  let user
  if (email === 'admin@admin.com' && password === 'admin') {
    user = {
      id: '021b7860-9a5a-4c88-85dc-3847f9ef2d3d',
      name: 'admin',
      roles: ['admin'],
    }
  }

  if (!user) {
    throw new Error('Invalid credentials')
  }

  if (!config.tokenSecret) {
    throw new Error('tokenSecret is not set')
  }

  const token = createToken(user)
  res.json({ token })
})

/**
 * @swagger
 * /profile/login:
 *   post:
 *     tags:
 *       - profile
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/register', async (req, res) => {
  const payload = req.body
  if (!payload) {
    throw new Error('Missing payload')
  }

  const existing = await UserModel.findOne({ where: { email: payload.email } })
  if (existing) {
    throw new Error('Email already exists')
  }

  const user = await createOrUpdate(UserModel, payload)
  const token = createToken(user)
  res.json({ token })
})

router.post('/oauthcallback', (req, res) => {
  const { oauthToken: token } = req.body

  res.json({ token })
})

router.post('/logff', (req, res) => {
  res.json({ success: true })
})

router.post('/revoke', (req, res) => {
  res.json({ success: true })
})

export default router
