const express = require("express");
const passport = require("passport");

const {
  getAllUsers,
  removeUser,
  updateUser,
  getCurrentUser,
} = require("../controllers/user.controller");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  logOut,
  refreshAccessToken,
  signAccessAndRefreshToken,
} = require("../controllers/auth.controller");

const {
  protectRouteMiddleware,
  restrictRouteMiddleware,
} = require("../middlewares/auth.middleware");
const { getCookieOptions } = require("../utils/authHelpers");
const ApiResponse = require("../utils/ApiResponse");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protectRouteMiddleware, updatePassword);

router.route("/getAll").get(getAllUsers);
router.route("/updateUser").patch(protectRouteMiddleware, updateUser);
router.route("/delete").delete(protectRouteMiddleware, removeUser);
router.route("/currentUser").get(protectRouteMiddleware, getCurrentUser);

router.route("/logout").post(protectRouteMiddleware, logOut);
router.route("/refreshToken").post(protectRouteMiddleware, refreshAccessToken);

router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/auth/google/callback")
  .get(
    passport.authenticate("google", { session: false }),
    async function (req, res) {
      try {
        const { accessToken, refreshToken } = await signAccessAndRefreshToken(req.user._id);

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
    }
  );

module.exports = router;
