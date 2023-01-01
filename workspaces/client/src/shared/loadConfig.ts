import { ClientSettings } from '@lib'
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
  setConfig(serverConfig)
}

export function setConfig(payload: ClientSettings) {
  const serverConfig = payload as { [key: string]: unknown }
  const indexed = config as unknown as { [key: string]: unknown }
  Object.keys(serverConfig).forEach((key: string) => {
    if (typeof serverConfig[key] === 'object') {
      indexed[key] = {
        ...(indexed[key] as { [key: string]: unknown }),
        ...(serverConfig[key] as object),
      }
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
