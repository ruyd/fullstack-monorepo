import axios from 'axios'
import packageJson from '../../package.json'

export interface Config {
  baseName: string
  apiUrl: string
  defaultTitle: string
  defaultLineSize: number
  defaultColor: string
  thumbnails: {
    width: number
    height: number
  }
  auth?: {
    domain: string
    baseUrl: string
    redirectUrl: string
    clientId: string
    audience: string
    google?: {
      clientId: string
    }
  }
}
const env = process.env
const defaultBaseName = process.env.NODE_ENV === 'test' ? '/' : packageJson.homepage || '/'
const config: Config = {
  baseName: env.BASE_NAME || defaultBaseName,
  apiUrl: env.BACKEND || 'https://drawspace-api.herokuapp.com/v1',
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
    audience: `https://client`,
    redirectUrl: env.AUTH_REDIRECT_URL || 'http://localhost:3000/callback',
    clientId: env.AUTH_CLIENT_ID || '',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
}

export function applyConfig() {
  axios.defaults.baseURL = config.apiUrl
}

export default config
