const app = require("./app");

const port = process.env.EXPRESS_PORT || 6000;
const nodeEnv =
  process.env.NODE_ENV === "development" ? "Development" : "Production";

// Connecting Database
require("./db")
  .connectDB()
  .then(() =>
    app.listen(port, () => {
      console.log(nodeEnv, "Server is running on port", port);
    })
  )
  .catch((error) => {
    console.error("MongoDB connection Failed\n", error);
    process.exit(1);
  });
