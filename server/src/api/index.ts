import express from 'express'
import { autoApiRouterInject } from './_auto/routes'
import profile from './profile/routes'
import { DrawingModel, UserModel } from '../types'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
export const autoApiModels = [DrawingModel, UserModel]
autoApiRouterInject(autoApiModels, router)

export default router
