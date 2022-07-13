import { DataTypes } from 'sequelize/types'
import { define, Entity } from '.'

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
}

export const DrawingAttributes = define<Drawing>({
  name: 'drawing',
  attributes: {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
    },
    history: {
      type: DataTypes.JSONB,
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
  },
})
