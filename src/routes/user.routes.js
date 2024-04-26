const express = require("express");
const {
  getAllUsers,
  removeUser,
  updateUser,
} = require("../controllers/user.controller");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
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

router.route("/").get(getAllUsers);
router.route("/updateUser").patch(protectRouteMiddleware, updateUser);
router.route("/delete").delete(removeUser);
// .post(createUser);

// router.route("/:id").get(getUser).patch(updateUser).delete(removeUser);

module.exports = router;
