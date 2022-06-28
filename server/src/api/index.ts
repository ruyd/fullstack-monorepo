import express from 'express'
import profile from './profile/routes'
import db from '../shared/db'
import {
  getHandler,
  listHandler,
  saveHandler,
  deleteHandler,
} from './_auto/routes'
import { tokenCheck } from '../shared/auth'
import { DrawingModel } from './drawings/models'

const router = express.Router()
router.use('/profile', profile)

//Auto CRUD
const _init = [DrawingModel]
db.modelManager.models.every((model) => {
  const prefix = `${model.name.toLowerCase()}`
  router.get(`/${prefix}`, tokenCheck, listHandler.bind(model))
  router.get(`/${prefix}/:id`, tokenCheck, getHandler.bind(model))
  router.post(`/${prefix}`, tokenCheck, saveHandler.bind(model))
  router.delete(`/${prefix}/:id`, tokenCheck, deleteHandler.bind(model))
})

export default router
