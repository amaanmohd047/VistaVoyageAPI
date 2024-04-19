function handleUnhandledRejection(server) {
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION!! Shutting Down the Server");
    console.error(err);
    server.close(() => {
      console.log("Server Closed‼️");
      process.exit(1);
    });
  });
}

module.exports = handleUnhandledRejection;
