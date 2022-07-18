import 'express-async-errors'
import config from './shared/config'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import db, { models } from './shared/db'
import api from './api'
import { errorHandler } from './shared/errors'
import { swaggerDocModelInject } from './api/_auto/swagger'
import { autoApiRouter } from './api/_auto/routes'
;(async () => {
  //Initialize Models
  await db.authenticate()
  await db.createSchema(config.db.schema, {})
  await db.sync({ alter: !config.production })

  const app: Express = express()
  app.use(express.json({ limit: config.jsonLimit }))
  app.use(cors())

  //Auto Swagger
  const swaggerDoc = swaggerJsdoc({
    swaggerDefinition: config.swaggerSetup,
    apis: ['./src/**/swagger.yaml', './src/api/**/*.ts'],
  })
  swaggerDocModelInject(models, swaggerDoc)
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  )

  //Auto CRUD
  autoApiRouter(models, api)

  //Apply API
  app.use(`/${config.prefix}`, api)

  //Errors
  app.use(errorHandler)

  //Start server
  app.get('/', (req: Request, res: Response) => {
    res.send(`Starter Backend ${config.swaggerSetup.info.title}`)
  })

  app.listen(config.port, () => {
    console.log(
      `⚡️[server]: Server is running at https://localhost:${config.port} with SwaggerUI Admin at ${config.swaggerSetup.basePath}`
    )
  })
})()
