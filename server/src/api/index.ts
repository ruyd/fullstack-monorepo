import express from 'express'
import drawings from './drawings/routes'
import db from '../shared/db'

const router = express.Router()

router.use('/drawings', drawings)

db.modelManager.models.every((model) => {
  const routeName = model.name.toLowerCase()

  router.use(`/${routeName}`, model.routes)
})

export default router
