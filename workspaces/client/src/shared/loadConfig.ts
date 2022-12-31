import axios from 'axios'
import { patch } from 'src/features/app'
import config from './config'
import store from './store'

export default async function loadConfig() {
  // Remotish config
  const serverConfig = (await axios.get('/config'))?.data
  if (!serverConfig) {
    return
  }
  const indexed = config as unknown as { [key: string]: unknown }
  Object.keys(serverConfig).forEach((key: string) => {
    if (typeof serverConfig[key] === 'object') {
      indexed[key] = { ...(indexed[key] as { [key: string]: unknown }), ...serverConfig[key] }
    } else {
      indexed[key] = serverConfig[key]
    }
  })
  store.dispatch(
    patch({
      ...serverConfig,
      loaded: true,
    }),
  )
  return serverConfig
}
