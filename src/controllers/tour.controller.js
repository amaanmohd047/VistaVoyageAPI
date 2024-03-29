const fs = require("fs");
const ApiResponse = require("../utils/ApiResponse");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/tours-simple.json`)
);

// Middleware
exports.checkID = (req, res, next, val) => {
  if (req.params.id >= tours.length) {
    return res.status(400).json(new ApiResponse(404, null, "Invalid ID"));
  }

  next();
};

// Route Handlers
exports.getAllTours = (req, res) => {
  res.status(200).json(new ApiResponse(200, tours, "success"));
};

exports.getTour = (req, res) => {
  if (req.params.id >= tours.length)
    res.status(404).json({ status: "fail", message: "Invalid ID" });

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json(new ApiResponse(200, tour, "success"));
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.error(err);
      res.status(201).json(new ApiResponse(200, newTour, "success"));
    }
  );
};

exports.updateTour = (req, res) => {
  if (req.params.id >= tours.length)
    res.status(404).json({ status: "fail", message: "Invalid ID" });

  res.status(200).json({
    status: "success",
    data: {
      message: "<Updated tour in this field>",
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id >= tours.length)
    res.status(404).json({ status: "fail", message: "Invalid ID" });

  res.status(200).json({
    status: "success",
    data: {
      message: "deleted user successfully",
    },
  });
};
