const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");

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

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
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

  passwordChangedAt: {
    type: Date,
  },

  passwordResetToken: {
    type: String,
  },

  passwordResetExpires: {
    type: Date,
  },
});

// A middleware the runs before Model.prototype.save()
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// Decreasing 1 sec because there might be a lag between signing jwt token and saving document that might result in them not being equal.
userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});

// Instance Methods
userSchema.methods.checkPassword = async function (password) {
  const user = await User.findById(this._id).select("password");
  const result = await bcrypt.compare(password, user.password);
  return result;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
