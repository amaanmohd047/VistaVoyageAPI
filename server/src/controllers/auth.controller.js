const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

const User = require("../models/users.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signUp = asyncHandler(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

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

  if (!email || !password)
    throw new ApiError(404, "Please provide email and password!");

  if (!user)
    throw new ApiError(401, "Incorrect Email or Password! Please try again");

  const correct = await user.checkPassword(password);
  if (!correct)
    throw new ApiError(401, "Incorrect Email or Password! Please try again");

  const userRes = {
    id: user._doc._id,
    role: user._doc.role,
    name: user._doc.name,
    email: user._doc.email,
    token: signToken(user._id),
  };

  res
    .status(200)
    .json(new ApiResponse(200, userRes, "User logged in successfully!"));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(400, "No user found with this email!");

  const token = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${token}`;

  const expireTime = `${user.passwordResetExpires.toDateString()} ${
    user.passwordResetExpires.toTimeString().split(" ")[0]
  }`;

  const message = `Forgot Password? Submit a PATCH request with the new password and passwordConfirm to ${resetURL}.\n If you didn't forget your password, ignore this email.\n\n This email is valid for 10 minutes till ${expireTime}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      message: message,
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Reset token sent to the email!"));
  } catch (error) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, error.message);
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm)
    throw new ApiError(400, "Please provide a password and passwordConfirm");

  if (req.body.password !== req.body.passwordConfirm)
    throw new ApiError(
      400,
      "password and passwordConfirm does not match. Try Again!!"
    );

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(404, "Token is invalid or is expired");

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;

  await user.save();

  const token = signToken(user._id);

  res
    .status(200)
    .json(
      new ApiResponse(200, { token: token }, "Password reset successfully!")
    );
});

const updatePassword = asyncHandler(async (req, res, next) => {
  // Get user from collection
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    throw new ApiError(
      401,
      "You are not logged in. Please log in and try again"
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  if (!decoded) throw new ApiError(401, "Invalid token. Please log in again!");

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, "Invalid token.");

  // check if current password is correct
  if (
    !req.body.currentPassword ||
    !req.body.newPassword ||
    !req.body.passwordConfirm
  )
    throw new ApiError(
      400,
      "Please provide a new password and new passwordConfirm and current password."
    );

  const correct = await user.checkPassword(req.body.currentPassword);
  if (!correct)
    throw new ApiError(401, "Incorrect password. Please try again!");
  // if it is, then update password

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const newToken = signToken(user._id);

  // log in user and send jwt
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { token: newToken },
        "Password updated successfully!"
      )
    );
});

exports.signUp = signUp;
exports.logIn = logIn;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.updatePassword = updatePassword;
