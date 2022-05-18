"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
/**
 * Handler for all requests that throw an Error.
 *
 * Inspired by:
 * - https://dev.to/lvidakovic/handling-custom-error-types-in-express-js-1k90
 * - https://github.com/danielfsousa/express-rest-boilerplate/
 */
function errorHandler(err, req, res, next) {
    const response = {
        status: err.status,
        code: err.name,
        message: err.message,
        data: err.data,
        stack: err.stack,
    };
    console.error(`Client with IP="${req.ip}" failed to complete request to="${req.method}" originating from="${req.originalUrl}". Status="${err.status}" Message="${err.message}"`, err);
    if (!err.isPublic) {
        response.message = 'Internal server error';
        delete response.data;
    }
    if (process.env.NODE_ENV !== 'development') {
        delete response.stack;
    }
    res.status(err.status);
    res.json(response);
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map