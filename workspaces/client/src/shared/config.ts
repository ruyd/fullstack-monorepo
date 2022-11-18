import axios from 'axios'
import packageJson from '../../package.json'

export interface Config {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  baseName: string
  apiUrl: string
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
    audience: `https://backend`,
    clientId: env.AUTH_CLIENT_ID || '',
    redirectUrl: env.AUTH_REDIRECT_URL || 'http://localhost:3000/callback',
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
}

export async function applyConfig() {
  axios.defaults.baseURL = config.apiUrl
  // Remotish config
  const serverConfig = (await axios.get<Config>('/config'))?.data
  if (serverConfig) {
    Object.keys(serverConfig).forEach(key => {
      config[key] = { ...config[key], ...serverConfig[key] }
    })
  }
}

export default config
