export interface Config {
  apiUrl: string
  defaultTitle: string
}

const config: Config = {
  apiUrl: process.env.REACT_APP_BACKEND_URL || '',
  defaultTitle: 'Drawspace',
}

export default config
