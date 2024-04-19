const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/user.controller");
const {
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/updatePassword", updatePassword);

router.route("/").get(getAllUsers);
router.route("/delete").delete(deleteUser);
// .post(createUser);

// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
