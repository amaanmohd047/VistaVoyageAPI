const express = require("express");
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

const {
  protectRouteMiddleware,
  restrictRouteMiddleware,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protectRouteMiddleware, updatePassword);

router.route("/getAll").get(getAllUsers);
router.route("/updateUser").patch(protectRouteMiddleware, updateUser);
router.route("/delete").delete(protectRouteMiddleware, removeUser);
router.route("/current-user").get(protectRouteMiddleware, getCurrentUser);

router.route("/logout").post(protectRouteMiddleware, logOut);
router.route("/refreshToken").post(protectRouteMiddleware, refreshAccessToken);

module.exports = router;
