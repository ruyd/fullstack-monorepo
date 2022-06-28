import { Model, ModelStatic } from 'sequelize/types'
import { HttpNotFoundError } from '../../shared/errors'
import { PagingOptions } from '../../shared/types'

export async function list(
  model: ModelStatic<any>,
  where: { userId?: string } = {},
  page: PagingOptions = { limit: 100, offset: 0 }
): Promise<any[]> {
  const items = (await model.findAll({
    raw: true,
    where,
    ...page,
  })) as unknown as any[]
  return items
}

export async function getIfExists<T>(
  model: ModelStatic<Model>,
  id: string
): Promise<Model> {
  const item = await model.findByPk(id)
  if (!item) {
    throw new HttpNotFoundError(`Record with id ${id} not found`)
  }
  return item
}

export async function createOrUpdate<T extends Model>(
  model: ModelStatic<Model>,
  payload: any
): Promise<T> {
  const [item] = await model.upsert(payload)
  return item.get()
}

export async function deleteIfExists(
  model: ModelStatic<Model>,
  id: string
): Promise<any> {
  const item = await getIfExists(model, id)
  await item.destroy()
  return item.get()
}
