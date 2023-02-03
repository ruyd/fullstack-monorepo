import express from 'express'

const { CLIENT_ID, APP_SECRET } = process['env']
const base = 'https://api-m.sandbox.paypal.com'

export async function capturePaymentHandler(req: express.Request, res: express.Response) {
  const { orderID } = req.params
  const captureData = await capturePayment(orderID)
  // TODO: store payment information such as the transaction ID
  res.json(captureData)
}

export async function createOrderHandler(req: express.Request, res: express.Response) {
  const orderData = await createOrder()
  res.json(orderData)
}

// use the orders api to create an order
async function createOrder() {
  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders`
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '100.00',
          },
        },
      ],
    }),
  })
  const data = await response.json()
  return data
}

async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken()
  const url = `${base}/v2/checkout/orders/${orderId}/capture`
  const response = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const data = await response.json()
  return data
}

async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ':' + APP_SECRET).toString('base64')
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'post',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })
  const data = await response.json()
  return data.access_token
}
