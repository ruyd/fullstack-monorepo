import express from 'express'
import drawings from './drawings/routes'
import db from '../shared/db'
import {
  getHandler,
  listHandler,
  saveHandler,
  deleteHandler,
} from './auto/routes'
import { tokenCheck } from '../shared/auth'

const router = express.Router()

//Auto CRUD Routes
db.modelManager.models.every((model) => {
  const routePrefix = `${model.name.toLowerCase()}`
  const listing = listHandler.bind(model)
  router.get(`/${routePrefix}`, tokenCheck, listing)
  router.get(`/${routePrefix}/:id`, tokenCheck, getHandler.bind(model))
  router.post(`/${routePrefix}`, tokenCheck, saveHandler.bind(model))
  router.patch(`/${routePrefix}`, tokenCheck, saveHandler.bind(model))
  router.delete(`/${routePrefix}/:id`, tokenCheck, deleteHandler.bind(model))
})

router.use('/drawings', drawings)

export default router
