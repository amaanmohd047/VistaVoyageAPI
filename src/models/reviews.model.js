// review:
//  - ratings
//  - ref to Tour
//  - ref to User
//  - createdAt

const mongoose = require("mongoose");
const Tour = require("./tours.model");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review is required!"],
    },
    rating: {
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

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  console.log(stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsCount: stats[0].nRating || 0,
    ratingsAverage: stats[0].avgRating || 0,
  });
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findByIdAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findByIdAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
