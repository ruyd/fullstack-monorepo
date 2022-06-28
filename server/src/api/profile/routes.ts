import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /profile:
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
  const { user, password } = req.body

  res.json({ token: 'token', user: { id: '1' } })
})

router.post('/logff', (req, res) => {
  res.json({ success: true })
})

router.post('/revoke', (req, res) => {
  res.json({ success: true })
})

export default router
