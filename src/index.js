const app = require("./app");

const port = process.env.EXPRESS_PORT || 6000;

app.listen(port, () => {
  console.log(
    `${process.env.NODE_ENV === "development" ? "Development" : "Production"}` +
      " Server is running on port",
    port
  );
});
