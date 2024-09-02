exports.DB_NAME = "vistas-voyage";

exports.hppWhiteList = [
  "duration",
  "ratingsQuantity",
  "ratingsAverage",
  "maxGroupSize",
  "difficulty",
  "price",
];

exports.isNodeEnvDev = process.env.NODE_ENV === "development";

exports.port = process.env.PORT || 4000;
