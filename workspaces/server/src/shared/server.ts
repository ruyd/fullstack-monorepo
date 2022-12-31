import express from 'express'
import config from './config'
export type ExpressStack = {
  name: string
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
  [key: string]: string
  from: string
}

export function getRoutesFromApp(app: express.Application) {
  const composite = app._router.stack.find((s: ExpressStack) => s.name === 'router') as ExpressStack
  const recurse = (list: ExpressStack[], level = 0): End[] => {
    let result: { [key: string]: string; from: string }[] = []
    for (const s of list) {
      if (s.route?.path) {
        result.push({
          [Object.keys(s.route.methods).join(',')]: s.route.path,
          from: level === 1 ? 'model-api' : 'controller',
        })
      } else {
        result = [...result, ...recurse(s.handle.stack, level + 1)]
      }
    }

    return result
  }
  return recurse([composite])
}

// Homepage
export function homepage(req: express.Request, res: express.Response) {
  const title = config.swaggerSetup.info?.title || 'Backend'
  res.send(`<html><title>${title}</title>
    <body style="
      display: flex;
      align-items: center;
      justify-content: center;
    ">
    <div>
    ⚡️[server]: Backend is running on ${req.headers.host} with <a href="${config.swaggerSetup.basePath}">SwaggerUI Admin at ${config.swaggerSetup.basePath}</a>
    </div>
    </body></html>`)
}
