const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

// Routers
const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");
const { globalErrorHandler } = require("./middlewares/ErrorHandler");
const ApiError = require("./utils/ApiError");

const app = express();

// ::TODO:: Validate the data using zod in a middleware
// app.use(schemaValidator)
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  throw new ApiError(404, `Could not find ${req.originalUrl} on this server!`);
});

app.use(globalErrorHandler);

app.on("error", (err) => console.error("Error: ", err));

module.exports = app;
