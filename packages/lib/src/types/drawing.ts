import { Entity, User } from '.'

export enum ActionType {
  Open = 0,
  Close = 1,
  Stroke = 2,
}

/**
 * Reducing space as much as possible
 * c: color
 * st: style
 * ts: unix timestamp
 * w: width/size
 */
export interface DrawAction {
  t: ActionType
  c?: string
  st?: string
  x?: number
  y?: number
  w?: number
  ts?: number
}

export interface Drawing extends Entity {
  id?: string
  userId?: string
  name: string
  history: DrawAction[]
  thumbnail?: string
  user?: User
}

export function estimateTimeSpent(d: Drawing): number {
  const first = d.history[0]?.ts as number
  const last = d.history[d.history.length - 1]?.ts as number
  const millisecs = last - first
  return millisecs
}
