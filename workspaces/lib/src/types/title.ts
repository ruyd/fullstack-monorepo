import { Blab } from './blab'
import { Chapter } from './chapter'

export interface Title {
  titleId?: string
  title?: string
  urlName?: string
  subscriptions?: string[]
  tokens?: number
  blabs?: Blab[]
  chapters?: Chapter[]
  paywall?: boolean
}
