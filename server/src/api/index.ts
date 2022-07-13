import express from 'express'
import { autoApiRouterInject } from './_auto/routes'
import profile from './profile/routes'
import { UserModel } from './profile/models'
import { tokenCheckWare } from '../shared/auth'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
export const autoApiModels = [UserModel]
autoApiRouterInject(autoApiModels, router, tokenCheckWare)

export default router
