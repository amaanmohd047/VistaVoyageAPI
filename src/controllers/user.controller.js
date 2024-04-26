const User = require("../models/users.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { filterRequestObject } = require("../utils/helper");


const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users) throw new ApiError(404, "No users found!");

  res
    .status(200)
    .json(
      new ApiResponse(200, users, "Users fetched successfully!", users.length)
    );
});

const removeUser = asyncHandler(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    throw new ApiError(400, "Bad Request. Email and password required!");

  const email = req.body.email;
  const pass = req.body.password;

  const user = await User.findOne({ email: email });

  if (!user) throw new ApiError(404, "No such user found!");

  if (!user.checkPassword(pass))
    throw new ApiError(404, "Invalid email or password. Please try again");

  const deletedUser = await User.deleteOne({ email: email });

  if (!deletedUser)
    throw new ApiError(
      500,
      "Something went wrong while deleting the user. Please try again!"
    );

  console.log("user deleted", deletedUser);

  res
    .status(200)
    .json(new ApiResponse(204, null, "User deleted successfully!"));
});

const updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    throw new ApiError(400, "You can't update your password!");

  if (req.body.role) throw new ApiError(400, "You can't update your role!");

  const update = filterRequestObject(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser)
    throw new ApiError(
      500,
      "Something went wrong while updating details. Please try again!"
    );

  res
    .status(200)
    .json(
      new ApiResponse(204, updatedUser, "User details updated successfully!")
    );
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const deletedUser = await User.updateOne(
    { _id: req.user._id },
    { active: false },
    { new: true }
  );

  if (!deletedUser)
    throw new ApiError(
      500,
      "Something went wrong while deleting the user. Please try again!"
    );

  res
    .status(200)
    .json(new ApiResponse(204, null, "User deleted successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully!"));
});

exports.updateUser = updateUser;
exports.getAllUsers = getAllUsers;
exports.removeUser = removeUser;
exports.deleteUser = deleteUser;
exports.getCurrentUser = getCurrentUser;
