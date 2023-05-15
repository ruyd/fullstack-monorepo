/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Stripe from 'stripe'
import { Cart, CheckoutRequest, OrderStatus, Price, Product, User } from '@lib'
import express from 'express'
import logger from 'src/shared/logger'
import { CartModel, EnrichedRequest, UserModel } from '../../shared/types'
import { OrderModel } from '../../shared/types/models/order'
import config from 'src/shared/config'
import { ProductModel } from 'src/shared/types/models/product'
import Connection from 'src/shared/db'
import { Model } from 'sequelize'

async function getTotalCharge(userId: string) {
  const items = (await CartModel.findAll({
    where: { userId },
    include: ['drawing', 'product'],
    raw: true,
    nest: true
  })) as unknown as Cart[]
  const subtotal = items.reduce((acc, item) => {
    const price = item.priceId
      ? item.product?.prices?.find(p => p.id === item.priceId)?.amount ?? 0
      : item.drawing?.price ?? 0
    return acc + price * item.quantity
  }, 0)
  // TODO: Add shipping and tax
  // TODO: Return metadata with tuple?
  return subtotal
}

export async function checkout(_req: express.Request, res: express.Response) {
  const req = _req as EnrichedRequest
  const { ids, intent, shippingAddressId } = req.body as CheckoutRequest
  const listTotal = await getTotalCharge(req.auth.userId)
  const total = intent?.amount
  const order = (
    await OrderModel.create({
      userId: req.auth?.userId,
      status: OrderStatus.Pending,
      shippingAddressId,
      total
    })
  ).get()

  await CartModel.destroy({ where: { userId: req.auth.userId } })

  res.json({ ...order })
}

function getStripe() {
  const apiKey = config.settings.internal?.secrets?.stripe?.apiKey
  if (!apiKey) {
    throw new Error('Stripe API Key not configured')
  }
  return new Stripe(apiKey, {
    apiVersion: '2022-11-15'
  })
}

export async function stripeCreatePaymentIntent(req: express.Request, res: express.Response) {
  const stripe = getStripe()
  try {
    const { userId } = (req as EnrichedRequest).auth
    const user = (await UserModel.findByPk(userId, { raw: true })) as unknown as User
    const total = await getTotalCharge(userId)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: 'USD',
      receipt_email: user.email || ''
    })
    res.json({ paymentIntent })
  } catch (e) {
    const err = e as Stripe.errors.StripeAPIError & { raw?: { message: string; type: string } }
    const message = err.raw?.message || err.message
    logger.error(e)
    res.status(500).json({ error: { message } })
  }
}

export function stripeWebHook(request: express.Request, response: express.Response) {
  const stripe = getStripe()
  const endpointSecret = config.settings.internal?.secrets?.stripe?.webhookKey

  let event = request.body
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'] as string
    try {
      event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret)
    } catch (err) {
      const error = err as Error
      logger.error(`⚠️  Webhook signature verification failed.`, error.message)
      return response.sendStatus(400)
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object
      logger.info(`PaymentIntent for ${paymentIntent.amount} was successful!`)
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break
    }
    case 'payment_method.attached': {
      const paymentMethod = event.data.object
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break
    }
    case 'identity.verification_session.verified': {
      // All the verification checks passed
      const verificationSession = event.data.object
      break
    }
    case 'identity.verification_session.requires_input': {
      // At least one of the verification checks failed
      const verificationSession = event.data.object
      console.log('Verification check failed: ' + verificationSession.last_error.reason)

      // Handle specific failure reasons
      switch (verificationSession.last_error.code) {
        case 'document_unverified_other': {
          // The document was invalid
          break
        }
        case 'document_expired': {
          // The document was expired
          break
        }
        case 'document_type_not_supported': {
          // document type not supported
          break
        }
        default: {
          // ...
        }
      }
      break
    }
    default: {
      logger.error(`Unhandled event type ${event.type}.`)
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send()
}

export async function stripeCreateVerifyIdentitySession(
  req: express.Request,
  res: express.Response
) {
  const stripe = getStripe()
  try {
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        user_id: '{{USER_ID}}'
      }
      // Additional options for configuring the verification session:
      // options: {
      //   document: {
      //     # Array of strings of allowed identity document types.
      //     allowed_types: ['driving_license'], # passport | id_card
      //
      //     # Collect an ID number and perform an ID number check with the
      //     # document’s extracted name and date of birth.
      //     require_id_number: true,
      //
      //     # Disable image uploads, identity document images have to be captured
      //     # using the device’s camera.
      //     require_live_capture: true,
      //
      //     # Capture a face image and perform a selfie check comparing a photo
      //     # ID and a picture of your user’s face.
      //     require_matching_selfie: true,
      //   }
      // },
    })

    // Send publishable key and PaymentIntent details to client
    res.send({
      client_secret: verificationSession.client_secret
    })
  } catch (e) {
    const err = e as Error
    logger.error(e)
    return res.status(400).send({
      error: {
        message: err.message
      }
    })
  }
}

/**
 * On-demand sync of products from Stripe to the database
 * @param req
 * @param res
 */

export async function syncProductsHandler(req: express.Request, res: express.Response) {
  const stripe = getStripe()
  const products = await stripe.products.list({ limit: 100, active: true })
  const prices = await stripe.prices.list({ limit: 100 })
  const existing = await ProductModel.findAndCountAll({
    where: {}
  })

  const result = []

  const productsCache = products.data.map(product => ({
    productId: product.id,
    title: product.name,
    description: product.description as string,
    imageUrl: product.images[0],
    prices: prices.data
      .filter(p => p.product === product.id)
      .map(
        p =>
          ({
            id: p.id,
            amount: p.unit_amount,
            currency: p.currency,
            interval: p.recurring?.interval,
            intervalCount: p.recurring?.interval_count,
            freeTrialDays: p.recurring?.trial_period_days
          } as Price)
      )
  }))

  for (const product of productsCache) {
    const [item] = await ProductModel.upsert(product)
    result.push(item.get())
  }

  await cleanProducts(existing, productsCache)

  res.json(result)
}

export async function cleanProducts(
  existing: {
    rows: Model<Product, Product>[]
    count: number
  },
  productsCache: Product[]
) {
  const toRemove = existing.rows
    .filter(p => !productsCache.find(c => c.productId === p.getDataValue('productId')))
    .map(p => p.getDataValue('productId'))

  if (toRemove.length > 0) {
    try {
      const resu = (await Connection.db.getQueryInterface().bulkDelete('products', {
        product_id: toRemove
      })) as { rowCount: number }[]
      logger.info(`Removed ${resu[1].rowCount} products`)
    } catch (e) {
      logger.error(e)
    }
  }
}
