import express from 'express'
import { checkFirebase, gallery, sendClientConfigSettings, start } from './controller'

const router = express.Router()

router.get(['/gallery', '/gallery/:userId'], gallery)

router.get('/config', sendClientConfigSettings)

router.post('/start', start)

router.post('/firebase/check', checkFirebase)

export default router
