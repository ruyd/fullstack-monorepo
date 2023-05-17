import express from 'express'
import { addSubscriptionToCart, checkout } from './controller'
import {
  stripeCreatePaymentIntent,
  stripeCreateVerifyIdentitySession,
  stripeWebHook,
  syncProductsHandler
} from './stripe'
import { capturePaymentHandler, createOrderHandler } from './paypal'

const router = express.Router()

router.post('/shop/checkout', checkout)

router.post('/shop/subscribe', addSubscriptionToCart)

router.post('/stripe/payment/intent', stripeCreatePaymentIntent)

router.post('/stripe/identity/start', stripeCreateVerifyIdentitySession)

router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebHook)

router.get('/stripe/products/sync', syncProductsHandler)

router.post('/paypal/order', createOrderHandler)

router.post('/api/orders/:orderID/capture', capturePaymentHandler)

export default router
