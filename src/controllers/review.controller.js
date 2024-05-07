const Review = require("../models/reviews.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter).select("-__v");

  if (!reviews) throw new ApiError(404, "No reviews found!");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviews,
        "Fetched reviews successfully!",
        reviews.length
      )
    );
});

const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(filter).select("-__v");
  if (!review) throw new ApiError(404, "No review found with this Id!");
  res
    .status(200)
    .json(new ApiResponse(200, review, "Fetched review successfully!"));
});

const createReview = asyncHandler(async (req, res, next) => {
  const newReview = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour || req.params.tourId,
    user: req.user._id,
  };

  console.log(newReview);
  if (
    !(newReview.review && newReview.rating && newReview.tour && newReview.user)
  )
    throw new ApiError(400, "Please provide review, ratings, tour, and user!");

  const existingReview = await Review.findOne({
    tour: newReview.tour,
    user: newReview.user,
  });

  if (existingReview)
    throw new ApiError(
      400,
      "You have already reviewed this tour! You can only review each tour once."
    );

  const review = await Review.create({ ...newReview });

  const createdReview = await Review.findById(review._id);
  if (!createdReview)
    throw new ApiError(500, "Could not create review! Please try again");

  res
    .status(201)
    .json(new ApiResponse(201, createdReview, "Review created successfully!"));
});

const updateReview = asyncHandler(async (req, res, next) => {
  const updateFields = {
    review: req.body?.review,
    ratings: req.body?.ratings,
  };

  const reviewUser = await Review.findById(req.params.id).select("user");

  if (reviewUser.user.toString() !== req.user._id.toString())
    throw new ApiError(401, "You can't update review for others!");

  if (!(updateFields.review || updateFields.ratings))
    throw new ApiError(400, "Please provide review or rating!");

  const review = await Review.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
  }).select("-__v");
  if (!review)
    throw new ApiError(
      500,
      "Something went wrong while updating review. Please try again!"
    );

  res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully!"));
});

const deleteReview = asyncHandler(async (req, res, next) => {
  const reviewUser = await Review.findById(req.params.id).select("user");
  if (!reviewUser) throw new ApiError(404, "No review found with this Id!");

  if (reviewUser.user.toString() !== req.user._id.toString())
    throw new ApiError(401, "You can't delete review for others!");

  const deletedReview = await Review.deleteOne({ _id: req.params.id });
  if (!deletedReview)
    throw new ApiError(
      500,
      "Something went wrong while deleting review. Please try again!"
    );
  res
    .status(200)
    .json(new ApiResponse(200, null, "Review deleted successfully!"));
});

exports.getAllReviews = getAllReviews;
exports.getReview = getReview;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
