const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || err.status < 500 ? "fail" : "error";
  err.errors = err.errors || [];
  console.log(err);

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
  });
};

const checkValidObjectId = (req, res, next) => {
  const id = req.params.id;
  const isValid = mongoose.isValidObjectId(id);
  if (isValid) {
    next();
  } else {
    throw new ApiError(
      403,
      "BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
    );
  }
};

exports.globalErrorHandler = globalErrorHandler;
exports.checkValidObjectId = checkValidObjectId;
