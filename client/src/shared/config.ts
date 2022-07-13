export interface Config {
  apiUrl: string
  defaultTitle: string
  thumbnails: {
    width: number
    height: number
  }
}

const config: Config = {
  apiUrl: process.env.REACT_APP_BACKEND_API || 'defaultbackendurl',
  defaultTitle: 'Drawspace',
  thumbnails: {
    width: 300,
    height: 200,
  },
}

export default config
