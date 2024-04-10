const Tour = require("../models/tours.model");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/ApiFeatures");

// Get all tours
const getAllTours = asyncHandler(async (req, res) => {
  /* 
    // Another Way
    const feature = await new ApiFeatures(Tour.find(), req.query)
    .filter({
      excluded: ["page", "sort", "limit", "fields"],
    })
    .sort()
    .fieldLimit()
    .paginate()

    const tours = await feature.query
  */
  const tours = await new ApiFeatures(Tour, req.query)
    .filter({
      excluded: ["page", "sort", "limit", "fields"],
    })
    .sort()
    .fieldLimit()
    .paginate().query;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tours,
        "Fetched All Tours Successfully!",
        tours.length
      )
    );
});

// Get tour by ID
const getTour = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);

  if (!tour) throw new ApiError(404, "Could not find a tour by the Id:", id);

  res
    .status(200)
    .json(new ApiResponse(200, tour, "Fetched This Tour Successfully!"));
});

// Create new tour
const createTour = asyncHandler(async (req, res) => {
  const newTour = await Tour.create({ ...req.body });
  const createdTour = await Tour.findById(newTour._id);

  if (!createdTour) throw new ApiError(503, "Could not create new tour!");

  res
    .status(200)
    .json(new ApiResponse(201, newTour, "Tour Created Successfully"));
});

// Update existing tour by Id
const updateTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!tour) throw new ApiError(404, "No tour found with this Id!");

  res
    .status(200)
    .json(new ApiResponse(200, tour, "Tour Upadated Successfully!"));
});

// Delete tour by Id
const deleteTour = asyncHandler(async (req, res) => {
  const deletedTour = await Tour.deleteOne({ _id: req.params.id });

  if (!deletedTour) throw new ApiError(404, "No tour found with this Id!");

  res
    .status(204)
    .json(new ApiResponse(204, deleteTour, "Tour Deleted Successfully!"));
});

// Exports
exports.getAllTours = getAllTours;
exports.getTour = getTour;
exports.createTour = createTour;
exports.updateTour = updateTour;
exports.deleteTour = deleteTour;
