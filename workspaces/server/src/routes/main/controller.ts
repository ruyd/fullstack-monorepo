import express from 'express'
import sequelize from 'sequelize'
import logger from '../../shared/logger'
import { list } from '../../shared/model-api/controller'
import { DrawingModel, EnrichedRequest, SettingModel, UserModel } from '../../shared/types'
import { v4 as uuid } from 'uuid'
import { createToken } from '../../shared/auth'
import { getClientSettings, getSettingsAsync } from '../../shared/settings'
import { SystemSettings } from '@lib'
import { getFirebaseApp } from 'src/shared/firebase'
import { getAuth } from 'firebase-admin/auth'

export async function start(req: express.Request, res: express.Response) {
  logger.info(`Database Initialization by: ${req.body.email}`)
  logger.info('Creating internal settings...')
  let defaultSetting = (await SettingModel.findOne({ where: { name: 'internal' } }))?.get()
  if (defaultSetting) {
    res.status(500)
    res.json({ ok: false, error: 'Database already initialized' })
    return
  }
  let error: Error | null = null
  try {
    defaultSetting = (
      await SettingModel.create({
        name: 'internal',
        data: {
          startAdminEmail: req.body.email
        }
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

  logger.info('Creating system settings...')
  const systemSetting = (
    await SettingModel.create({
      name: 'system',
      data: {
        disable: true
      } as SystemSettings
    })
  )?.get()
  if (!systemSetting) {
    res.status(500)
    res.json({ ok: false, error: 'Failed to create system setting' })
    return
  }

  let user = (await UserModel.findOne({ where: { email: req.body.email } }))?.get()
  if (!user) {
    user = (
      await UserModel.create({
        userId: uuid(),
        email: req.body.email,
        firstName: 'Admin'
      })
    ).get()
  }

  const token = createToken({
    ...user,
    roles: ['admin']
  })

  res.json({ ok: true, token, user })
}

export async function gallery(req: express.Request, res: express.Response) {
  const conditional = req.params.userId ? { userId: req.params.userId } : {}
  const items = await list(DrawingModel, {
    where: {
      ...conditional,
      private: {
        [sequelize.Op.not]: true
      }
    }
  })
  res.json(items)
}

export async function sendClientConfigSettings(req?: express.Request, res?: express.Response) {
  const user = (req as EnrichedRequest).auth
  const isAdmin = user?.roles?.includes('admin')
  const payload = await getClientSettings(isAdmin)
  res?.json(payload)
  return payload
}

export async function checkFirebase(req: express.Request, res: express.Response) {
  const settings = await getSettingsAsync()
  const google = settings?.google
  const isProjectValid =
    google?.projectId &&
    google?.apiKey &&
    google?.appId &&
    google?.measurementId &&
    google?.messagingSenderId
  const isServiceReady = settings?.internal?.secrets?.google?.serviceAccountJson
  const isAuthValid = google?.clientId && settings?.internal?.secrets?.google?.clientSecret
  if (!isProjectValid || !isServiceReady || !isAuthValid) {
    res.json({
      ok: false,
      message: 'Firebase Project and Credentials are not filled properly'
    })
    return
  }

  const checkApp = await getFirebaseApp()
  if (!checkApp) {
    res.json({
      ok: false,
      message: 'Firebase App cannot initialize'
    })
  }

  const auth = getAuth(checkApp)
  try {
    const tokenx = await auth.createCustomToken('test-1')
    res.json({
      ok: tokenx,
      message: `Success! Firebase Authenticated a Test JWT Token: ${tokenx.substring(0, 10)}...`
    })
  } catch (err) {
    const error = err as Error
    res.json({
      ok: false,
      message: error.message
    })
  }
}
