import { Model, ModelStatic } from 'sequelize/types'

const conversions = {
  INTEGER: 'number',
  BIGINT: 'number',
  FLOAT: 'number',
  DOUBLE: 'number',
  DECIMAL: 'number',
  NUMERIC: 'number',
  REAL: 'number',
  DATE: 'string',
  DATETIME: 'string',
  TIMESTAMP: 'string',
  TIME: 'string',
}

export function getSchema(model) {
  const excluded = ['createdAt', 'updatedAt']
  const columns = Object.entries(model.tableAttributes).filter(
    ([name]) => !excluded.includes(name)
  ) as [[string, any]]
  const properties = {}
  for (const [name, attribute] of columns) {
    const type = conversions[attribute.type] || 'string'
    const definition = attribute.allowNull ? { type, required: true } : { type }
    properties[name] = definition
  }
  return {
    type: 'object',
    properties,
  }
}

export function getPaths(model) {
  const tagName = model.name.toLowerCase()
  const tags = [tagName]
  const $ref = `#/components/schemas/${model.name}`
  const paths = {
    [`/${tagName}`]: {
      get: {
        summary: 'Get list',
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref,
                  },
                },
              },
            },
          },
        },
        tags,
      },
      post: {
        summary: 'Create or update an item',
        required: true,
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref,
              },
            },
          },
        },
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  $ref,
                },
              },
            },
          },
        },
        tags,
      },
    },
    [`/${tagName}/{id}`]: {
      get: {
        summary: 'Get one',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID of the item to retrieve',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  $ref,
                },
              },
            },
          },
        },
        tags,
      },
      delete: {
        summary: 'Delete one',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'ID of the item to delete',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            content: {
              'application/json': {
                schema: {
                  success: { type: 'boolean' },
                },
              },
            },
          },
        },
        tags,
      },
    },
  }
  return paths
}

export function swaggerDocModelInject(models: typeof Model[], swaggerDoc) {
  models.every((model) => {
    const schema = getSchema(model)
    const existingSchema = swaggerDoc?.components?.schemas[model.name]
    if (!existingSchema) {
      swaggerDoc.components.schemas[model.name] = schema
    }

    const paths = getPaths(model)
    for (const p in paths) {
      const existingPath = swaggerDoc.paths[p]
      if (!existingPath) {
        swaggerDoc.paths[p] = paths[p]
      }
    }
  })
}