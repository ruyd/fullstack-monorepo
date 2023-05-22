import { ClientConfig, Setting, SettingDataType, SettingState } from '@lib'
import config from './config'
import Connection from './db'
import logger from './logger'
import { SettingModel } from './types'
import { omit } from 'lodash'
import NodeCache from 'node-cache'

export const SettingsCache = new NodeCache({ stdTTL: 100, useClones: false })

export function getAuth0Settings(data: unknown) {
  const value = data as { [key: string]: string | boolean }
  const merged = {
    ...config.auth,
    ...value,
    enabled: value.enabled === true,
    sync: value.sync === true,
    domain: `${value.tenant}.auth0.com`,
    baseUrl: `https://${value.tenant}.auth0.com`,
    explorerAudience: `https://${value.tenant}.auth0.com/api/v2/`
  }
  config.auth = merged
}

function setGoogle(result: SettingState) {
  const json = JSON.parse(result.internal?.secrets?.google?.serviceAccountJson || '{}')
  const projectId = json?.project_id
  if (result.google && !result.google.projectId) {
    result.google.projectId = projectId
  }
}

export async function getSettingsAsync(freshNotCached = false): Promise<SettingState> {
  const cache = SettingsCache.get('settings')
  if (cache && !freshNotCached) {
    logger.info(`Skipping settings load, cache hit...`)
    return cache as SettingState
  }

  if (!Connection.initialized) {
    throw new Error(`Skipping settings load, no connection...`)
  }
  logger.info(`Loading settings...`)
  const result = {} as SettingState
  try {
    const settings = (await SettingModel.findAll({ raw: true })) as unknown as Setting[]
    for (const setting of settings) {
      result[setting.name] = (setting as unknown as { data: SettingDataType }).data
    }
  } catch (e) {
    logger.error(e)
  }

  setGoogle(result)

  SettingsCache.set('settings', result)

  return result
}
export async function getClientSettings(isAdmin = false): Promise<ClientConfig> {
  const allSettings = await getSettingsAsync()
  const admin =
    !config.production || isAdmin
      ? {
          models: config.db.models
        }
      : undefined

  const settings = omit(allSettings, 'internal')
  const payload = {
    settings,
    admin,
    ready: !!settings.system
  }
  return payload as ClientConfig
}
