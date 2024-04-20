const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const getCookieOptions = (env) => {
  const cookieExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const cookieOptions = {
    expires: cookieExpires,
    httpOnly: true,
  };
  if (env === "production") {
    cookieOptions.secure = true;
  }

  return cookieOptions;
};

module.exports = { signToken, getCookieOptions };
