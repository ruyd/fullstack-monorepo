import express from 'express'
import {
  checkout,
  stripeCreatePaymentIntent,
  stripeCreateVerifyIdentitySession,
  stripeWebHook,
  syncProductsHandler,
} from './controller'
import { capturePaymentHandler, createOrderHandler } from './paypal'

const router = express.Router()

router.post('/shop/checkout', checkout)

router.post('/stripe/payment/intent', stripeCreatePaymentIntent)

router.post('/stripe/identity/start', stripeCreateVerifyIdentitySession)

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebHook)

router.post('/paypal/order', createOrderHandler)

router.post('/api/orders/:orderID/capture', capturePaymentHandler)

router.get('/products/sync', syncProductsHandler)

export default router
