export * from './models/drawing'
export * from './models/user'
export * from './models/setting'
export * from './models/cart'
export * from './models/order'
export * from './models/subscription'
export * from './models/category'
export * from './models/item'
export * from './models/item.category'

import express from 'express'
import { EntityConfig } from '../db'
import { AppAccessToken } from '@lib'

export type EnrichedRequest = express.Request & {
  auth: AppAccessToken
  config?: EntityConfig
}
