import express from 'express'
import { autoApiRouter } from './_auto/routes'
import profile from './profile'
import main from './main'
import { models } from '../shared/db'

const router = express.Router()
router.use(main)
router.use('/profile', profile)

export default router
