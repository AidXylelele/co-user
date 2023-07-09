class CustomError extends Error {
    constructor(name, message) {
      super(message);
      this.name = name;
      Error.captureStackTrace(this, this.constructor);
    }
  }

module.exports = { CustomError };