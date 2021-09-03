const ApiError = require('./ApiError');

/**
 * Thrown when the record trying to be retrieve was not found.
 */
class RecordNotFound extends ApiError {
  constructor(message) {
    super(message || 'Not found', 404);
  }
}

module.exports = RecordNotFound;
