import { ClientSettings } from '@lib'
import packageJson from '../../package.json'

/**
 * move most to redux and settings
 */
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
  settings: ClientSettings
  admin: {
    path: string
    models?: string[]
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
  settings: {},
  admin: {
    path: '/admin',
    models: [],
  },
}

export default config
