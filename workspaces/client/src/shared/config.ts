import packageJson from '../../package.json'

export interface Config {
  baseName: string
  backendUrl: string
  defaultTitle: string
  defaultLineSize: number
  defaultColor: string
  thumbnails: {
    width: number
    height: number
  }
  auth: {
    domain: string
    baseUrl: string
    redirectUrl: string
    clientId: string
    audience: string
    google?: {
      clientId: string
    }
  }
  admin: {
    path: string
    models?: string[]
  }
  keys: {
    stripe?: string
    paypal?: string
  }
}
const env = process['env']
const defaultBaseName = process.env.NODE_ENV === 'test' ? '/' : packageJson.homepage || '/'
export const config: Config = {
  baseName: env.BASE_NAME || defaultBaseName,
  backendUrl: env.BACKEND || 'https://api.drawspace.app',
  defaultTitle: 'Drawspace',
  defaultColor: 'green',
  defaultLineSize: 5,
  thumbnails: {
    width: 250,
    height: 250,
  },
  auth: {
    domain: `${env.AUTH_TENANT}.auth0.com`,
    baseUrl: `https://${env.AUTH_TENANT}.auth0.com`,
    audience: `https://backend`,
    clientId: env.AUTH_CLIENT_ID || '',
    redirectUrl: env.AUTH_REDIRECT_URL || 'https://api.drawspace.app/callback',
    google: {
      clientId: env.GOOGLE_CLIENT_ID || '',
    },
  },
  admin: {
    path: '/admin',
    models: [],
  },
  keys: {
    stripe: env.STRIPE_KEY || '',
    paypal: env.PAYPAL_KEY || '',
  },
}

export default config
