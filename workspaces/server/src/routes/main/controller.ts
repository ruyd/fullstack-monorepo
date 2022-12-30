import express from 'express'
import sequelize from 'sequelize'
import logger from '../../shared/logger'
import { list } from '../../shared/model-api/controller'
import { DrawingModel, SettingModel, UserModel } from '../../shared/types'
import { v4 as uuid } from 'uuid'
import { createToken } from '../../shared/auth'

export async function start(req: express.Request, res: express.Response) {
  logger.info(`Database Initialization by: ${req.body.startAdminEmail}`)
  logger.info('Creating default settings...')
  let defaultSetting
  let error: Error | null = null
  try {
    defaultSetting = (
      await SettingModel.create({
        name: 'internal',
        data: {
          startAdminEmail: req.body.email,
        },
      })
    ).get()
  } catch (e) {
    logger.error(e)
    error = e as Error
  }
  if (!defaultSetting) {
    res.status(500)
    res.json({ ok: false, error: error?.message })
    return
  }

  const user = (
    await UserModel.create({
      userId: uuid(),
      email: req.body.email,
      firstName: 'Admin',
    })
  ).get()

  const token = createToken({
    ...user,
    roles: ['admin'],
  })

  res.json({ ok: true, token, user })
}

export async function gallery(req: express.Request, res: express.Response) {
  const conditional = req.params.userId ? { userId: req.params.userId } : {}
  const items = await list(DrawingModel, {
    where: {
      ...conditional,
      private: {
        [sequelize.Op.not]: true,
      },
    },
  })
  res.json(items)
}
