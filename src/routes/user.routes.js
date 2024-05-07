const express = require("express");
const passport = require("passport");

const {
  getAllUsers,
  removeUser,
  updateUser,
  getCurrentUser,
  deleteUser,
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
router.route("/logout").post(protectRouteMiddleware, logOut);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").patch(resetPassword);
router.route("/updatePassword").patch(protectRouteMiddleware, updatePassword);

router.route("/updateUser").patch(protectRouteMiddleware, updateUser);
router
  .route("/currentUser")
  .get(protectRouteMiddleware, getCurrentUser)
  .delete(protectRouteMiddleware, deleteUser);

// ::TODO:: Delete this route after testing OR Restrict This route to only Admin.
router.route("/getAll").get(getAllUsers);
router.route("/delete").delete(protectRouteMiddleware, removeUser);
//

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
