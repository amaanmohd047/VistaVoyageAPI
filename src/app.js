require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { default: helmet } = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// Routers
const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");
const reviewRouter = require("./routes/review.routes");

// Middlewares
const { globalErrorHandler } = require("./middlewares/ErrorHandler");
const passport = require("./middlewares/oauth.middleware");

// Utils
const ApiError = require("./utils/ApiError");
const { hppWhiteList, isNodeEnvDev } = require("./constants");

const app = express();

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Middleware
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({ whitelist: hppWhiteList }));

// Serving static files
app.use(express.static("public"));

// Passport middleware initialization for Google OAuth
app.use(passport.initialize());

// API Request Logging
isNodeEnvDev ? app.use(morgan("dev")) : app.use(morgan("combined"));

// Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Handling Unhandled Routes
app.all("*", (req, res, next) => {
  throw new ApiError(404, `Could not find ${req.originalUrl} on this server!`);
});

// Global Error Handling
app.use(globalErrorHandler);

// Handling Uncaught Exceptions
app.on("error", (err) => console.error("Error: ", err));

module.exports = app;
