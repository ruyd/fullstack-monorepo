export * from './models/drawing'
export * from './models/user'
export * from './models/order'
export * from './models/setting'

import { JwtPayload } from 'jsonwebtoken'

export interface AppAccessToken extends JwtPayload {
  userId: string
  roles: string[]
}
