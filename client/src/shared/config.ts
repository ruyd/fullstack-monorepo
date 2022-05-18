export interface Config {
  apiUrl: string
}

const config: Config = {
  apiUrl: process.env.REACT_APP_BACKEND_URL || '',
}

export default config
