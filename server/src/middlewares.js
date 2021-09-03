const { validate: validateSchema, ValidationError } = require('express-validation');
const ApiError = require('./errors/ApiError');

/**
 * Validates a request
 */
const validate = (schema) => validateSchema(schema, { statusCode: 422 });

/**
 * Shows a not found response
 */
function notFound(req, _, next) {
  next(new ApiError(`Not Found - ${req.originalUrl}`, 404));
}

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */

  const runningInDevelopment = process.env.NODE_ENV !== 'production';

  const payload = {};

  if (err instanceof ValidationError) {
    res.status(422);
    payload.message = err.message;
    payload.error = err.error;
    payload.details = err.details;
  }

  if (err instanceof ApiError) {
    res.status(err.status);
    payload.message = err.message;
  }

  // If the status has not been set yet, we assume an unexpected error happend and set default
  // values.
  if (res.statusCode < 400) {
    payload.message = runningInDevelopment ? err.message : 'Internal server error';

    res.status(500);
  }

  if (runningInDevelopment && err.stack) {
    payload.stack = err.stack.split('\n');
  }

  res.json(payload);
}

module.exports = {
  validate,
  notFound,
  errorHandler
};
