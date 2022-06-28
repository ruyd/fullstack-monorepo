import express from 'express'
import db from '../shared/db'
import { autoApiRouterInject } from './_auto/routes'
import { DrawingModel } from './drawings/models'
import profile from './profile/routes'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
const _init = [DrawingModel]
autoApiRouterInject(db.modelManager.models, router)

export default router
