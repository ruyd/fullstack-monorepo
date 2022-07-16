import { Entity, User } from '.'

export enum ActionType {
  Open = 'o',
  Close = 'c',
  Stroke = 's',
}

export interface DrawAction {
  t: ActionType
  x?: number
  y?: number
  c?: string
  w?: number
  st?: string
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

export function calcDuration(d: Drawing) {
  const first = d.history[0]
  const last = d.history[d.history.length - 1]
  return first.ts.
}
