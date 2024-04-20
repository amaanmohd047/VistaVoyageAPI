const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { default: helmet } = require("helmet");
require("dotenv").config();

// Routers
const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");
const { globalErrorHandler } = require("./middlewares/ErrorHandler");
const ApiError = require("./utils/ApiError");

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

// Data sanitization against XSS

// Serving static files
app.use(express.static("public"));

// API Request Logging
process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

// Routers
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handling Unhandled Routes
app.all("*", (req, res, next) => {
  throw new ApiError(404, `Could not find ${req.originalUrl} on this server!`);
});

// Global Error Handling
app.use(globalErrorHandler);

// Handling Uncaught Exceptions
app.on("error", (err) => console.error("Error: ", err));

module.exports = app;
