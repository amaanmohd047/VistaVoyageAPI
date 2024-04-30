// review:
//  - ratings
//  - ref to Tour
//  - ref to User
//  - createdAt

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review is required!"],
    },
    ratings: {
      type: Number,
      required: [true, "Ratings are required!"],
      validate: {
        validator: (value) => {
          return value >= 1 && value <= 5;
        },
        message: "Ratings must be between 1 and 5",
      },
    },

    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour!"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user!"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
