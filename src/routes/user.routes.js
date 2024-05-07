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
} = require("../controllers/auth.controller");

const { oAuthCallback } = require("../controllers/oauth.controller");

const { protectRouteMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protectRouteMiddleware, updatePassword);

// ::TODO:: Delete this route after testing OR Restrict This route to only Admin.
router.route("/getAll").get(getAllUsers);
// 

router.route("/update").patch(protectRouteMiddleware, updateUser);
router.route("/delete").delete(protectRouteMiddleware, removeUser);
router.route("/currentUser").get(protectRouteMiddleware, getCurrentUser);
router.route("/logout").post(protectRouteMiddleware, logOut);

// Route for refreshing access token
router.route("/refreshToken").post(protectRouteMiddleware, refreshAccessToken);


// Google OAuth Routes
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/auth/google/callback")
  .get(passport.authenticate("google", { session: false }), oAuthCallback);

module.exports = router;
