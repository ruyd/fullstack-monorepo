export interface Config {
  apiUrl: string
  defaultTitle: string
  thumbnails: {
    width: number
    height: number
  }
}

const config: Config = {
  apiUrl: process.env.REACT_APP_BACKEND_API || 'htts://localhost:3001/v1',
  defaultTitle: 'DrawSpace',
  thumbnails: {
    width: 300,
    height: 200,
  },
}

export default config
