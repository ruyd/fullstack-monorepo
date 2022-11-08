/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
// import profile from './profile'
// import main from './main'
import fs from 'fs'

const router = express.Router()
fs.readdirSync(__dirname).forEach(file => {
  if (file === 'index.ts') return
  const router = require(`./${file}`).default
  router.use(router)
})

// router.use(main)
// router.use(profile)

export default router
