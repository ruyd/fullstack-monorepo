export * from './drawing'

export interface Jwt {
  [key: string]: unknown
  iss?: string | undefined
  sub?: string | undefined
  aud?: string | string[] | undefined
  exp?: number | undefined
  nbf?: number | undefined
  iat?: number | undefined
  jti?: string | undefined
}

export interface AppAccessToken extends Jwt {
  userId: string
  roles: string[]
}

/**
 * Common Model Options
 * ie: Timestamps
 */
export interface Entity {
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export interface User extends Entity {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  picture?: string
}

export interface PagedResult<T> {
  items: T[]
  offset: number
  limit: number
  hasMore: boolean
  total: number
}
