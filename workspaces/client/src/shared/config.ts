/* eslint-disable no-console */
import axios from 'axios'
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
}
const env = process.env
const defaultBaseName = process.env.NODE_ENV === 'test' ? '/' : packageJson.homepage || '/'
export const config: Config = {
  baseName: env.BASE_NAME || defaultBaseName,
  backendUrl: env.BACKEND || 'https://drawspace-api.herokuapp.com',
  defaultTitle: 'Drawspace',
  defaultColor: 'yellow',
  defaultLineSize: 20,
  thumbnails: {
    width: 300,
    height: 200,
  },
  auth: {
    domain: `${env.AUTH_TENANT}.auth0.com`,
    baseUrl: `https://${env.AUTH_TENANT}.auth0.com`,
    audience: `https://backend`,
    clientId: env.AUTH_CLIENT_ID || '',
    redirectUrl: env.AUTH_REDIRECT_URL || 'https://drawspace-api.herokuapp.com/callback',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
  admin: {
    path: '/admin',
    models: [],
  },
}

export async function applyConfig() {
  axios.defaults.baseURL = config.backendUrl
  // Remotish config
  const serverConfig = (await axios.get('/config'))?.data
  if (!serverConfig) {
    return
  }
  Object.keys(serverConfig).forEach((key: string) => {
    const indexed = config as unknown as { [key: string]: unknown }
    console.log('index', indexed, key)
    //indexed['ruy'] = 'ruy'
    //indexed.key = serverConfig[key]
    if (typeof serverConfig[key] === 'object') {
      indexed[key] = { ...(indexed[key] as { [key: string]: unknown }), ...serverConfig[key] }
    } else {
      indexed[key] = serverConfig[key]
    }
  })
  console.log('config', config)
}

export default config
