const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const { isNodeEnvDev } = require("../constants");

const checkValidObjectId = (req, res, next) => {
  const id = req.params.id;
  if (!id) throw new ApiError(400, "Id is required!");

  const isValid = mongoose.isValidObjectId(id);

  if (!isValid)
    throw new ApiError(
      400,
      "BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      "BSONError"
    );

  next();
};

const handleDuplicacyError = (err, res) => {
  const value = { ...err.keyValue };
  const errors = Object.entries(value).map((obj) => `${obj[0]}: ${obj[1]}`);

  const msg =
    errors.length > 1
      ? `The following values are already in use! Please use other ones.z`
      : `The following value is already in use! Please use another one.`;

  res.status(400).json({
    statusCode: 400,
    status: "error",
    errorName: "Duplicate key error",
    message: msg,
    errorFields: [...errors],
  });
};

const sendErrorDev = (err, res) => {
  console.error("‼️", err);
  res.status(err.statusCode).json({
    error: err,
    statusCode: err.statusCode,
    errorName: err.errors,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      errorName: err.errors,
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("‼️", err);
    res.status(500).json({
      statusCode: err.statusCode,
      status: "error",
      message: "‼️Something Went Wrong",
    });
  }
};

// ::TODO::  Handle Validation Errors
const globalErrorHandler = (err, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || err.status < 500 ? "fail" : "error";
  err.errors = err.errors || [];

  const isDevServer = isNodeEnvDev;
  const isProdServer = isNodeEnvDev === false;

  if (isDevServer) {
    sendErrorDev(err, res);
  } else if (isProdServer) {
    if (err.code === 11000 || err.codeName === "DuplicateKey")
      handleDuplicacyError(err, res);

    if (err.name === "JsonWebTokenError")
      err = new ApiError(401, "Invalid Token. Please try again!");

    if (err.name === "TokenExpiredError")
      err = new ApiError(401, "Token Expired. Please log in again!");

    if (err.name === "ValidationError")  err = new ApiError(401, "Review validation failed. Either fieldname or value is invalid. Please check and try again!")
    sendErrorProd(err, res);
  }
};

// JsonWebTokenError

exports.checkValidObjectId = checkValidObjectId;

exports.globalErrorHandler = globalErrorHandler;
