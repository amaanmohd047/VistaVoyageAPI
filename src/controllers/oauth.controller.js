const { getCookieOptions } = require("../utils/authHelpers");
const ApiResponse = require("../utils/ApiResponse");
const { signAccessAndRefreshToken } = require("./auth.controller");
const asyncHandler = require("../utils/asyncHandler");


const oAuthCallback = asyncHandler(async function (req, res, next) {
  try {
    const { accessToken, refreshToken } = await signAccessAndRefreshToken(
      req.user._id
    );

    const cookieOptions = getCookieOptions();
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: req.user,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      ); // Redirect to the dashboard or any other route
  } catch (error) {
    console.error("Error generating tokens:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.oAuthCallback = oAuthCallback;
