const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

// Routers
const tourRouter = require("./routes/tour.routes");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

process.env.NODE_ENV === "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.on("error", (err) => console.error("Error: ", err));

module.exports = app;
