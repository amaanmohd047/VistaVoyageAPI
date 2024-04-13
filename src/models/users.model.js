const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name is required!"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "An email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      "Invalid Email! Please provide a valid email",
    ],
  },

  photo: {
    type: String,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm the password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same‼️",
    },
  },
});

// A middleware the runs before Model.save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
