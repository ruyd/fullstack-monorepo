import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../../shared/config'

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
    user = { id: '1', name: 'admin' }
  }

  if (!user) {
    throw new Error('Invalid credentials')
  }

  if (!config.tokenSecret) {
    throw new Error('tokenSecret is not set')
  }

  const token = jwt.sign(user, config.tokenSecret, {
    expiresIn: '2d',
  })
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
