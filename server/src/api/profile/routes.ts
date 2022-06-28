import express from 'express'

const router = express.Router()

router.post('/login', (req, res) => {
  const { user, password } = req.body

  res.json({ token: 'token', user: { id: '1' } })
})

export default router
