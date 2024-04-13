const jwt = require("jsonwebtoken");

const User = require("../models/users.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const signToken = (id) => {
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        name: newUser.name,
        email: newUser.email,
        token: token,
      },
      "New User created successfully!"
    )
  );
};

const signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  const token = signToken(newUser._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        name: newUser.name,
        email: newUser.email,
        token: token,
      },
      "New User created successfully!"
    )
  );
});

const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  console.log(user.password);

  if (!email || !password)
    throw new ApiError(404, "Please provide email and password!");

  if (!user || !user.checkPassword(password))
    throw new ApiError(401, "Incorrect Email or Password! Please try again‼️");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User logged in successfully!"));
});

// const signUp = asyncHandler(async (req, res, next) => {});

exports.signUp = signUp;
exports.logIn = logIn;
