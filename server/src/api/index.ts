import express from 'express'
import drawings from './drawings/routes'

const router = express.Router()

router.use('/drawings', drawings)

export default router
