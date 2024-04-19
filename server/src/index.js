// Handling Uncaught Exceptions (Sync Exceptions) from the app
require("./utils/handleUncaughtExceptions")();

const app = require("./app");
const ApiError = require("./utils/ApiError");

const port = process.env.EXPRESS_PORT || 6000;
const nodeEnv =
  process.env.NODE_ENV === "development" ? "Development" : "Production";

// Connecting Database
require("./db").connectDB();

const server = app.listen(port, () => {
  console.log(nodeEnv, "Server is running on port", port);
});

// Handling Uncaught Rejections (Async Exceptions) from the app
require("./utils/handleUnhandledRejection")(server);
