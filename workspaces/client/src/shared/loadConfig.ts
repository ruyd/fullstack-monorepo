import { ClientConfig } from '@lib'
import axios from 'axios'
import { patch } from '../features/app'
import config from './config'
import store from './store'

export default async function loadConfig() {
  // Remotish config
  const serverConfig = (await axios.get('/config'))?.data
  if (!serverConfig) {
    return
  }
  setConfig(serverConfig)
  return serverConfig
}

export function setConfig(payload: ClientConfig) {
  if (!payload || Object.keys(payload).length === 0) {
    return
  }

  const fromServer = payload as unknown as { [key: string]: unknown }
  // update config - TODO, reduce or remove config
  const indexed = config as unknown as { [key: string]: unknown }
  Object.keys(fromServer).forEach((key: string) => {
    if (typeof fromServer[key] === 'object') {
      indexed[key] = {
        ...(indexed[key] as { [key: string]: unknown }),
        ...(fromServer[key] as object)
      }
    } else {
      indexed[key] = fromServer[key]
    }
  })
  // update state
  store.dispatch(
    patch({
      ...fromServer,
      loaded: true
    })
  )
  return fromServer
}
