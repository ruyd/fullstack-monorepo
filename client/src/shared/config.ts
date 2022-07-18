import axios from 'axios'

export interface Config {
  apiUrl: string
  defaultTitle: string
  defaultLineSize: number
  thumbnails: {
    width: number
    height: number
  }
}

const config: Config = {
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
