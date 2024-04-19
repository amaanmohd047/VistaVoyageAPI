const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");

const DB_URI = process.env.MONGODB_URI.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
).replace("<DB_NAME>", DB_NAME);

exports.connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(DB_URI);
    console.log(
      `Database connection successful! \nDB_HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Database Connection Failed! \nError: ", error);
    throw new Error(error);
  }
};
