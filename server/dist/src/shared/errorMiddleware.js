"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorConverter = exports.errorHandler = void 0;
const sequelize_1 = require("sequelize");
const errors_1 = require("./errors");
/**
 * Handler for all requests that throw an Error.
 *
 * Inspired by:
 * - https://dev.to/lvidakovic/handling-custom-error-types-in-express-js-1k90
 * - https://github.com/danielfsousa/express-rest-boilerplate/
 */
function errorHandler(err, req, res, next) {
    // Note: this is the structure of the JSON object that we reply with to any client requests
    const response = {
        status: err.status,
        code: err.name,
        message: err.message,
        data: err.data,
        stack: err.stack,
    };
    // Log the error before we change the stack or message properties
    console.error(`Client with IP="${req.ip}" failed to complete request to="${req.method}" originating from="${req.originalUrl}". Status="${err.status}" Message="${err.message}"`, err);
    // Only 4xx error status codes return a public message and data properties.
    // Everything else will need to be checked in our PaperTrail logs, as exposing
    // internal server errors to public API clients would otherwise be a security concern.
    if (!err.isPublic) {
        response.message = 'Internal server error';
        delete response.data;
    }
    // Send stacktrace only during development. You can add `NODE_ENV=development` to your
    // `.env` file to show stacktraces in your console.
    if (process.env.NODE_ENV !== 'development') {
        delete response.stack;
    }
    res.status(err.status);
    res.json(response);
}
exports.errorHandler = errorHandler;
/**
 * Converts error objects coming from the application to standardized errors
 */
function errorConverter(err, req, res, next) {
    let convertedError = err;
    // If sequelize rejected the query and did not return a result, we return 404 Not Found
    if (err instanceof sequelize_1.EmptyResultError) {
        convertedError = new errors_1.HttpNotFoundError();
    }
    // In case we encounter another type of error we return 500 Internal Server Error
    else if (!(err instanceof errors_1.HttpError)) {
        convertedError = new errors_1.HttpError({
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    }
    return errorHandler(convertedError, req, res, next);
}
exports.errorConverter = errorConverter;
//# sourceMappingURL=errorMiddleware.js.map