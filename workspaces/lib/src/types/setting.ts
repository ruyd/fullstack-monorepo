export enum SettingType {
  System = 'system',
  Provider = 'provider',
  Plugin = 'plugin',
}

export interface Setting {
  name: string
  type?: SettingType
  value?: string
  values?: string
  enabled?: boolean
}
