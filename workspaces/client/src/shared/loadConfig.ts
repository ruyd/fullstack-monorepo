import axios from 'axios'
import { patch } from 'src/features/app'
import config from './config'
import store from './store'

export default async function loadConfig() {
  axios.defaults.baseURL = config.backendUrl
  // Remotish config
  const serverConfig = (await axios.get('/config'))?.data
  if (!serverConfig) {
    return
  }
  Object.keys(serverConfig).forEach((key: string) => {
    const indexed = config as unknown as { [key: string]: unknown }
    if (typeof serverConfig[key] === 'object') {
      indexed[key] = { ...(indexed[key] as { [key: string]: unknown }), ...serverConfig[key] }
    } else {
      indexed[key] = serverConfig[key]
    }
  })
  store.dispatch(
    patch({
      ...serverConfig,
    }),
  )
  return serverConfig
}
