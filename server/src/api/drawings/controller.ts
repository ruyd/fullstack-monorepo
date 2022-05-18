import { HttpNotFoundError } from '../../shared/errors'
import { PagingOptions } from '../../shared/types'
import { Drawing, DrawingInstance, DrawingModel } from './models'

export async function list(
  userId: string,
  page: PagingOptions = { limit: 100, offset: 0 }
): Promise<Drawing[]> {
  const items = (await DrawingModel.findAll({
    raw: true,
    where: { userId },
    ...page,
  })) as unknown as Drawing[]
  return items
}

export async function getIfExists(id: string): Promise<DrawingInstance> {
  const item = await DrawingModel.findByPk(id)
  if (!item) {
    throw new HttpNotFoundError(`Record with id ${id} not found`)
  }
  return item
}

export async function createOrUpdate(payload: Drawing): Promise<Drawing> {
  const [item] = await DrawingModel.upsert(payload)
  return item.get()
}

export async function deleteIfExists(id: string): Promise<Drawing> {
  const item = await getIfExists(id)
  await item.destroy()
  return item.get()
}
