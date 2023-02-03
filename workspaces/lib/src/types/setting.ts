export const SettingTypes = {
  System: 'system',
  Google: 'google',
  Auth0: 'auth0',
  Internal: 'internal',
} as const

export interface SystemSettings {
  disable: boolean
  enableStore: boolean
  enableAuth?: boolean
  enableCookieConsent?: boolean
  enableOneTapLogin?: boolean
  enableRegistration?: boolean
  paymentMethods?: {
    stripe?: PaymentMethodSettings
    paypal?: PaymentMethodSettings
  }
}
export interface GoogleSettings {
  clientId?: string
  clientSecret?: string
  projectId?: string
  analyticsId?: string
  enabled?: boolean
}

export interface Auth0Settings {
  clientId?: string
  clientSecret?: string
  tenant?: string
  clientAudience?: string
  explorerId?: string
  explorerSecret?: string
  sync?: boolean
  enabled?: boolean
}

export interface PaymentMethodSettings {
  enabled: boolean
  secretKey?: string
  publishableKey?: string
  webhookSecret?: string
}

export interface InternalSettings {
  startAdminEmail: string
}

export type SettingType = typeof SettingTypes[keyof typeof SettingTypes]
export interface Setting<T = SystemSettings | GoogleSettings | Auth0Settings | InternalSettings> {
  name: SettingType
  data: T
}
export type SettingDataType = SystemSettings & GoogleSettings & Auth0Settings & InternalSettings
export interface SettingData {
  [SettingTypes.Internal]: InternalSettings
  [SettingTypes.System]: SystemSettings
  [SettingTypes.Google]: GoogleSettings
  [SettingTypes.Auth0]: Auth0Settings
}

export type ClientSettings = Partial<Omit<SettingData, 'internal'>>

export interface ClientConfig {
  admin: {
    models?: string[]
  }
  ready: boolean
  settings: ClientSettings
}
