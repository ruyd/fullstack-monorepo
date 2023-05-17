import express from 'express'
import main from './main'
import profile from './profile'
import shop from './shop'
import stripe from './stripe'

const router = express.Router()
router.use(main)
router.use(profile)
router.use(shop)
router.use(stripe)
export default router
