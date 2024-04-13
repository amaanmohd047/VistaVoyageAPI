exports.firstTrace = (err) =>
  err?.stack?.split("at")[1]?.split(">")[1]?.split("(")[1]?.split(")")[0];
