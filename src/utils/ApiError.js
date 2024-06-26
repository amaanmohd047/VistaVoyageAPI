class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = [],
    stack = ""
  ) {
    
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.status = this.statusCode < 500 ? "fail" : "error";
    this.errors = errors;
    this.message = message;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
