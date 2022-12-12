export * from './models/drawing'
export * from './models/user'
export * from './models/order'
export * from './models/setting'
export * from './models/cart'

import express from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { EntityConfig } from '../db'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}

export type EnrichedRequest = express.Request & {
  auth: AppAccessToken
  config?: EntityConfig
}
