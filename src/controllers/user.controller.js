const User = require("../models/users.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (!users) throw new ApiError(404, "No users found!");

  res
    .status(200)
    .json(
      new ApiResponse(200, users, "Users fetched successfully!", users.length)
    );
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
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

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     data: {
//       message: "Internal server error",
//     },
//   });
// };

// exports.createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     data: {
//       message: "Internal server error",
//     },
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     data: {
//       message: "Internal server error",
//     },
//   });
// };

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     data: {
//       message: "Internal server error",
//     },
//   });
// };
