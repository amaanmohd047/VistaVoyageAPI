const { firstTrace } = require("./FirstTrace");

function handleUncaughtExceptions() {
  process.on("uncaughtException", (err) => {
    const ft = firstTrace(err);

    console.log("UNHANDLED REJECTION!! Shutting Down the Server");
    console.error(err.name, ":", err.message);
    console.error(err);
    console.error(ft);
    process.exit(1);
  });
}

module.exports = handleUncaughtExceptions;
