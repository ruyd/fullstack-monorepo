import { NextFunction, Request, Response } from 'express'
import { EmptyResultError } from 'sequelize'
import { HttpError, HttpErrorParams, HttpNotFoundError } from './errors'

type HttpErrorResponse = Required<
  Pick<HttpErrorParams, 'status' | 'message'> & { code: string }
> &
  Pick<HttpErrorParams, 'data' | 'stack'>

/**
 * Handler for all requests that throw an Error.
 *
 * Inspired by:
 * - https://dev.to/lvidakovic/handling-custom-error-types-in-express-js-1k90
 * - https://github.com/danielfsousa/express-rest-boilerplate/
 */
export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Note: this is the structure of the JSON object that we reply with to any client requests
  const response: HttpErrorResponse = {
    status: err.status,
    code: err.name,
    message: err.message,
    data: err.data,
    stack: err.stack,
  }

  // Log the error before we change the stack or message properties
  console.error(
    `Client with IP="${req.ip}" failed to complete request to="${req.method}" originating from="${req.originalUrl}". Status="${err.status}" Message="${err.message}"`,
    err
  )

  // Only 4xx error status codes return a public message and data properties.
  // Everything else will need to be checked in our PaperTrail logs, as exposing
  // internal server errors to public API clients would otherwise be a security concern.
  if (!err.isPublic) {
    response.message = 'Internal server error'
    delete response.data
  }

  // Send stacktrace only during development. You can add `NODE_ENV=development` to your
  // `.env` file to show stacktraces in your console.
  if (process.env.NODE_ENV !== 'development') {
    delete response.stack
  }

  res.status(err.status)
  res.json(response)
}

/**
 * Converts error objects coming from the application to standardized errors
 */
export function errorConverter(
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let convertedError = err

  // If sequelize rejected the query and did not return a result, we return 404 Not Found
  if (err instanceof EmptyResultError) {
    convertedError = new HttpNotFoundError()
  }
  // In case we encounter another type of error we return 500 Internal Server Error
  else if (!(err instanceof HttpError)) {
    convertedError = new HttpError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    })
  }

  return errorHandler(convertedError, req, res, next)
}
