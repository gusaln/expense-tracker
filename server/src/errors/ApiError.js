class ApiError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.status = statusCode || 400;
  }
}

module.exports = ApiError;
