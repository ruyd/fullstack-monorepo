import express from 'express'
import { createServer } from 'http'
import { createServer as createServerHttps } from 'https'
import config from './config'
export interface ExpressStack {
  name: string | string[]
  handle: {
    name: string
    stack: ExpressStack[]
  }
  regexp: string
  route: {
    path: string
    methods: {
      get?: boolean
      post?: boolean
      patch?: boolean
    }
  }
}
export interface End {
  path: string
  methods: string[]
  from: string
}

export function getRoutesFromApp(app: express.Application) {
  const composite = app._router.stack.find((s: ExpressStack) => s.name === 'router') as ExpressStack
  const recurse = (list: ExpressStack[], level = 0): End[] => {
    let result: End[] = []
    for (const s of list) {
      const paths = Array.isArray(s.route?.path) ? s.route?.path : [s.route?.path]
      for (const path of paths) {
        if (path) {
          result.push({
            path: s.route.path,
            methods: Object.keys(s.route.methods),
            from: level === 1 ? 'model-api' : 'controller'
          })
        } else {
          result = [...result, ...recurse(s.handle.stack, level + 1)]
        }
      }
    }
    return result
  }
  return recurse([composite])
}

export function getBuildVersion() {
  try {
    const buildDate = process.env.BUILD_DATE || process['env'].COMMIT_DATE
    if (!buildDate) {
      return ''
    }
    const localDate = new Date(buildDate).toLocaleString()
    const builtOn = 'Built on: ' + localDate
    return builtOn
  } catch {
    return ''
  }
}

// Homepage
export function homepage(req: express.Request, res: express.Response) {
  const builtOn = getBuildVersion()
  const title = config.swaggerSetup.info?.title || 'Backend'
  res.send(`<html><title>${title}</title>
    <body style="
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    ">
    <div>
    ⚡️[server]: Backend is running on ${req.headers.host} with <a href="${config.swaggerSetup.basePath}">SwaggerUI Admin at ${config.swaggerSetup.basePath}</a>
    <br />${builtOn}
    </div>
    </body></html>`)
}

export function createServerService(app: express.Application) {
  const server =
    config.protocol === 'https'
      ? createServerHttps(
          {
            key: config.sslKey,
            cert: config.sslCert
          },
          app
        )
      : createServer(app)
  return server
}
