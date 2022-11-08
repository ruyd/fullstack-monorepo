/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
import fs from 'fs'
import path from 'path'
import logger from '../shared/logger'

const router = express.Router()

//todo: webpack script to bundle this
const dirs = fs.readdirSync(__dirname, { withFileTypes: false })
for (const dir of dirs) {
  logger.info(`Found API: ${dir}`)
  const router = require(path.resolve(__dirname, dir as string)).default
  router.use(router)
}

export default router
