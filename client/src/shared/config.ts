import axios from 'axios'

export interface Config {
  baseName: string
  apiUrl: string
  defaultTitle: string
  defaultLineSize: number
  thumbnails: {
    width: number
    height: number
  }
}

const config: Config = {
  baseName: process.env.REACT_APP_BASE_NAME || '/fullstack-monorepo',
  apiUrl: process.env.REACT_APP_BACKEND_API || 'htts://localhost:3001/v1',
  defaultTitle: 'DrawSpace',
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
