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

module.exports = { getCookieOptions };
