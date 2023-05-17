import express from 'express'
import {
  stripeCreatePaymentIntent,
  stripeCreateVerifyIdentitySession,
  stripeWebHook,
  syncProductsHandler
} from '../stripe/controller'

const router = express.Router()

router.post('/stripe/payment/intent', stripeCreatePaymentIntent)

router.post('/stripe/identity/start', stripeCreateVerifyIdentitySession)

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebHook)

router.get('/stripe/products/sync', syncProductsHandler)

export default router
