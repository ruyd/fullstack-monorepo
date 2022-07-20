import axios from 'axios'

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
}

const config: Config = {
  baseName: process.env.REACT_APP_BASE_NAME || '/fullstack-monorepo',
  apiUrl:
    process.env.REACT_APP_BACKEND || 'https://drawspace-api.herokuapp.com/v1',
  defaultTitle: 'Drawspace',
  defaultColor: 'yellow',
  defaultLineSize: 20,
  thumbnails: {
    width: 300,
    height: 200,
  },
}

export function applyConfig() {
  axios.defaults.baseURL = config.apiUrl
}

export default config
