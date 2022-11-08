import express from 'express'
import fs from 'fs'
import path from 'path'
import logger from '../shared/logger'

const router = express.Router()

const dirs = fs
  .readdirSync(__dirname, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)

for (const dir of dirs) {
  logger.info(`Found API: ${dir}`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const router = require(path.resolve(__dirname, dir)).default
  router.use(router)
}

export default router
