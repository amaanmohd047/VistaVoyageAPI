const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/users.model");

const protectRouteMiddleware = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  if (!token)
    throw new ApiError(401, "User not logged in. Please log in and try again!");

  // Verifying JWT Token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!decodedToken)
    throw new ApiError(401, "Invalid token. Please log in again!");

  // Checking if the user still exists
  const freshUser = await User.findById(decodedToken.id).select(
    "+refreshToken"
  );
  if (!freshUser)
    throw new ApiError(
      404,
      "The user that the token belongs to does no longer exists!"
    );

  // Check if the user has changed password after the token was issued
  if (freshUser.changedPasswordAfter(decodedToken.iat)) {
    throw new ApiError(
      401,
      "User recently changed password. Please log in again!"
    );
  }

  req.user = freshUser;
  next();
});

// Restrict access to certain routes
const restrictRouteMiddleware = (role) =>
  asyncHandler(async (req, res, next) => {
    if (!role) role = "admin";

    if (req.user.role !== role)
      throw new ApiError(
        403,
        "You do not have the permission to perform this action!"
      );

    next();
  });

exports.protectRouteMiddleware = protectRouteMiddleware;
exports.restrictRouteMiddleware = restrictRouteMiddleware;
