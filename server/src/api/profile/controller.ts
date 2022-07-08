import express from 'express'
import {
  createToken,
  authProviderLogin,
  authProviderRegister,
} from '../../shared/auth'
import { createOrUpdate } from '../_auto/controller'
import { UserModel } from './models'
import { tryDashesOrNewUUID } from '../../shared/util'

export async function register(req: express.Request, res: express.Response) {
  const payload = req.body
  if (!payload) {
    throw new Error('Missing payload')
  }

  const existing = await UserModel.findOne({ where: { email: payload.email } })
  if (existing) {
    throw new Error('Email already exists')
  }

  payload.userId = tryDashesOrNewUUID()
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

  const user = (await UserModel.findOne({ where: { email } }))?.get()
  if (!user) {
    throw new Error('User not found')
  }

  res.json({
    token: response.access_token,
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
