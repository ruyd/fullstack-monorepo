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
    google?: {
      clientId: string
    }
  }
}

const defaultBaseName = process.env.NODE_ENV === 'test' ? '/' : packageJson.homepage || '/'
const config: Config = {
  baseName: process.env.REACT_APP_BASE_NAME || defaultBaseName,
  apiUrl: process.env.REACT_APP_BACKEND || 'https://drawspace-api.herokuapp.com/v1',
  defaultTitle: 'Drawspace',
  defaultColor: 'yellow',
  defaultLineSize: 20,
  thumbnails: {
    width: 300,
    height: 200,
  },
  auth: {
    google: {
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
    },
  },
}

export function applyConfig() {
  axios.defaults.baseURL = config.apiUrl
}

export default config
