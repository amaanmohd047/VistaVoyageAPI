// Handling Uncaught Exceptions (Sync Exceptions) from the app
require("./utils/handleUncaughtExceptions")();

const app = require("./app");
const { isNodeEnvDev, port } = require("./constants");

// Connecting Database
require("./db").connectDB();

const nodeEnv = isNodeEnvDev ? "Development" : "Production";

// Listening on port 
const server = app.listen(port, () => {
  console.log(nodeEnv, "Server is running on port", port);
});

// Handling Uncaught Rejections (Async Exceptions) from the app
require("./utils/handleUnhandledRejection")(server);
