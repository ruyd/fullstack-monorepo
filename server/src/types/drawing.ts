import { DataTypes, Model } from 'sequelize'
import { db } from '../shared/db'
import { Entity } from '@root/lib'

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

export const DrawingModel = db.define<Model<Drawing>>('drawing', {
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
    type: DataTypes.TEXT,
  },
})
