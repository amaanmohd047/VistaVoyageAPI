const express = require("express");
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} = require("../controllers/user.controller");
const { signUp, logIn } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);

// router.route("/").get(getAllUsers).post(createUser);

// router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
