const crypto = require("crypto");

const User = require("../models/users.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/email");
const { getCookieOptions } = require("../utils/authHelpers");

const signAccessAndRefreshToken = async (id) => {
  try {
    const user = await User.findOne({ _id: id });

    const accessToken = user.signAccessToken(user._id);
    const refreshToken = user.signRefreshToken(user._id);
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens. Please try again!"
    );
  }
};

const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    throw new ApiError(
      400,
      "Please provide name, email, password and passwordConfirm"
    );
  }

  const userExists = await User.findOne({ email: email });

  if (userExists)
    throw new ApiError(400, "User with this email already exists!");

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
    role: req.body?.role,
  });

  const { accessToken, refreshToken } = await signAccessAndRefreshToken(
    newUser._id
  );
  const cookieOptions = getCookieOptions();

  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          accessToken,
          refreshToken,
        },
        "New User created successfully!"
      )
    );
});

const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.cookies);

  const user = await User.findOne({ email: email });

  if (!email || !password)
    throw new ApiError(404, "Please provide email and password!");

  if (!user)
    throw new ApiError(401, "Incorrect Email or Password! Please try again");

  const correct = await user.checkPassword(password);
  if (!correct)
    throw new ApiError(401, "Incorrect Email or Password! Please try again");

  const { accessToken, refreshToken } = await signAccessAndRefreshToken(
    user._id
  );
  const cookieOptions = getCookieOptions();

  const userRes = {
    id: user._doc._id,
    role: user._doc.role,
    name: user._doc.name,
    email: user._doc.email,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { ...userRes, accessToken, refreshToken },
        "User logged in successfully!"
      )
    );
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

  const { accessToken, refreshToken } = await signAccessAndRefreshToken(
    user._id
  );
  const cookieOptions = getCookieOptions();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Password reset successfully!"
      )
    );
});

const updatePassword = asyncHandler(async (req, res, next) => {
  // Get user from collection

  console.log(req.user._id);
  const user = await User.findById(req.user._id);

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

  const { accessToken, refreshToken } = await signAccessAndRefreshToken(
    user._id
  );
  const cookieOptions = getCookieOptions();

  // log in user and send jwt
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Password updated successfully!"
      )
    );
});

const logOut = asyncHandler(async (req, res, next) => {
  const id = req.user._id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  if (!user)
    throw new ApiError(
      404,
      "Something went wrong while logging out. Please try again!"
    );

  res
    .status(200)
    .clearCookie("accessToken", getCookieOptions())
    .clearCookie("refreshToken", getCookieOptions())
    .json(new ApiResponse(200, null, "Logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingToken =
    req.cookies?.accessToken ||
    req.headers.authorization.split(" ")[1] ||
    req.body.refreshToken;
  if (!incomingToken) throw new ApiError(401, "Unauthorized access");

  const decodedToken = await promisify(jwt.verify)(
    incomingToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!decodedToken)
    throw new ApiError(401, "Invalid refresh token. Please log in again!");

  const freshUser = await User.findById(decodedToken.id);
  if (!freshUser)
    throw new ApiError(404, "Invalid refresh token. Please log in again!");

  if (freshUser.refreshToken !== incomingToken)
    throw new ApiError(401, "Invalid refresh token. Please log in again!");

  const { accessToken, newRefreshToken } = await signAccessAndRefreshToken(
    freshUser._id
  );

  const cookieOptions = getCookieOptions();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Refreshed access token successfully!"
      )
    );
});

exports.signUp = signUp;
exports.logIn = logIn;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.updatePassword = updatePassword;
exports.logOut = logOut;
exports.refreshAccessToken = refreshAccessToken;
