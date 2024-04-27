const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const User = require("../models/users.model");
const ApiError = require("../utils/ApiError");

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/v1/users/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log("=========HERE==========");

      if (!profile)
        throw new ApiError(401, "Authentication Failed! Please try again.");

      console.log(profile);
      const { name, email } = profile._json;

      try {
        let freshUser = await User.findOne({ email: email });

        if (!(name && email))
          throw new ApiError(401, "Authentication Failed! Please try again.");

        if (!freshUser) {
          freshUser = new User({
            name: name,
            email: email,
          });

          await freshUser.save({ validateBeforeSave: false });
        }

        cb(null, freshUser);
      } catch (error) {
        cb(error);
      }
    }
  )
);

module.exports = passport;
