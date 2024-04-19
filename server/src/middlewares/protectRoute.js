const { promisify } = require("util");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const protectRouteMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
    throw new ApiError(401, "User not logged in. Please log in and try again!");

  // Verifying JWT Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) throw new ApiError(401, "Invalid token. Please log in again!");

  // Checking if the user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    throw new ApiError(
      404,
      "The user that the token belongs to does no longer exists!"
    );

  // Check if the user has changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(
      401,
      "User recently changed password. Please log in again!"
    );
  }

  req.user = freshUser;
  next();
});

const restrictRouteMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin")
    throw new ApiError(
      401,
      "You do not have the permission to perform this action!"
    );

  next();
});

exports.protectRouteMiddleware = protectRouteMiddleware;
exports.restrictRouteMiddleware = restrictRouteMiddleware;
