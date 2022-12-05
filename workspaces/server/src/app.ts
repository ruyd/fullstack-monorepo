import { config } from './shared/config'
import express from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc, { OAS3Definition } from 'swagger-jsdoc'
import { Connection } from './shared/db'
import { applyModelsToSwaggerDoc } from './shared/model-api/swagger'
import { registerModelApiRoutes } from './shared/model-api/routes'
import { errorHandler } from './shared/errorHandler'
import cors from 'cors'
import api from './routes'
import { activateAxiosTrace } from './shared/logger'
import { authProviderSync } from './shared/auth/sync'
import { checkDatabase } from './shared/db'

export function createBackendApp(): express.Express {
  const app = express()

  if (!config.production && config.trace) {
    activateAxiosTrace()
  }

  if (process.env.NODE_ENV !== 'test') {
    authProviderSync()
  }

  checkDatabase()

  // Basics
  app.use(cors())
  app.use(express.json({ limit: config.jsonLimit }))

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  )

  app.use(errorHandler)

  // Swagger Portal
  const swaggerDoc = swaggerJsdoc({
    swaggerDefinition: config.swaggerSetup as OAS3Definition,
    apis: ['**/*/swagger.yaml', '**/routes/**/index.*s'],
  }) as OAS3Definition

  applyModelsToSwaggerDoc(Connection.models, swaggerDoc)

  app.use(
    config.swaggerSetup.basePath,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      customSiteTitle: config.swaggerSetup.info?.title,
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  )

  // Endpoints
  registerModelApiRoutes(Connection.models, api)

  app.use(api)

  return app
}

export default createBackendApp
