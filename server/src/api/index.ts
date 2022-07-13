import express from 'express'
import { autoApiRouterInject } from './_auto/routes'
import profile from './profile/routes'
import { UserModel } from '../types/user'
import { tokenCheckWare } from '../shared/auth'
import { DrawingModel } from '../types'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
export const autoApiModels = [DrawingModel, UserModel]
autoApiRouterInject(autoApiModels, router, tokenCheckWare)

export default router
