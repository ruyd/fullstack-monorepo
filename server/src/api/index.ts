import express from 'express'
import { autoApiConfig, autoApiRouterInject } from './_auto/routes'
import profile from './profile/routes'
import { DrawingModel } from './drawings/models'
import { UserModel } from './profile/models'
import { tokenCheck } from '../shared/auth'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
export const autoApiModels = [DrawingModel, UserModel]
autoApiConfig.userIdName = 'userId'
autoApiRouterInject(autoApiModels, router, tokenCheck)

export default router
