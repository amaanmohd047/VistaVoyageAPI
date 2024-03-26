import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, World! ",
    number: 25243,
    port: port,
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server is listening on port", port);
});
