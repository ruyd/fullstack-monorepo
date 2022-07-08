import express from 'express'
import {
  createToken,
  decodeToken,
  authProviderLogin,
  authProviderRegister,
} from '../../shared/auth'
import config from '../../shared/config'
import uuid from 'uuid'
import { createOrUpdate } from '../_auto/controller'
import { UserModel } from './models'

export async function register(req: express.Request, res: express.Response) {
  const payload = req.body
  if (!payload) {
    throw new Error('Missing payload')
  }

  const existing = await UserModel.findOne({ where: { email: payload.email } })
  if (existing) {
    throw new Error('Email already exists')
  }

  payload.userId = uuid.v4()
  const providerResult = await authProviderRegister(payload)
  if (providerResult.error) {
    throw new Error(providerResult.error_description)
  }
  const user = await createOrUpdate(UserModel, payload)
  const token = createToken(user)
  res.json({ token })
}

export async function login(req: express.Request, res: express.Response) {
  const { email, password } = req.body

  const response = await authProviderLogin(email, password)
  if (response.error) {
    throw new Error(response.error_description)
  }

  //const decoded = decodeToken(response.id_token)
  const user = (await UserModel.findOne({ where: { email } }))?.get()
  if (!user) {
    throw new Error('User not found')
  }

  if (!config.tokenSecret) {
    throw new Error('tokenSecret is not set')
  }

  const token = createToken({
    userId: user?.userId,
    roles: [],
  })
  res.json({
    id_token: response.id_token,
    access_token: response.access_token,
    test: token,
  })
}

export async function edit(req: express.Request, res: express.Response) {
  const payload = req.body
  if (!payload) {
    throw new Error('Missing payload')
  }
  const user = await createOrUpdate(UserModel, payload)
  const token = createToken(user)
  res.json({ token })
}
