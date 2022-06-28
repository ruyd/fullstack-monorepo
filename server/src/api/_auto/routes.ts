import express from 'express'
import { Model, ModelStatic } from 'sequelize/types'
import { createOrUpdate, deleteIfExists, getIfExists, list } from './controller'

export async function saveHandler(this: typeof Model, req, res) {
  if (!this) {
    throw new Error('this is not defined')
  }
  if (!req.body) {
    return res.status(400).send('Request body is missing')
  }
  const model = this as ModelStatic<Model>
  const result = await createOrUpdate(model, req.body)
  res.json(result)
}

export async function deleteHandler(this: typeof Model, req, res) {
  if (!this) {
    throw new Error('this is not defined')
  }
  const model = this as ModelStatic<Model>
  const result = await deleteIfExists(model, req.params.id)
  res.json(result)
}

export async function getHandler(this: typeof Model, req, res) {
  if (!this) {
    throw new Error('this is not defined')
  }
  const model = this as ModelStatic<Model>
  const result = await getIfExists(model, req.params.id)
  res.json(result)
}

export async function listHandler(this: typeof Model, req, res) {
  if (!this) {
    throw new Error('this is not defined')
  }
  const where: { userId?: string } = {}
  const model = this as ModelStatic<Model>
  if (model.getAttributes().userId) {
    where.userId = req.auth.id
  }
  const limit = Number(req.query.limit || 100)
  const offset = Number(req.query.offset || 0)
  const result = await list(model, where, { limit, offset })
  res.json(result)
}
