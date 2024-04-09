const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name!"],
    unique: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, "Tour duration is required!"],
  },

  maxGroupSize: {
    type: Number,
    required: [true, "MaxGroupSize is required!"],
  },

  ratingAverage: {
    type: Number,
  },

  ratingCount: {
    type: Number,
  },

  price: {
    type: Number,
    required: [true, "A tour must have a price!"],
  },

  discount: {
    type: Number,
    default: 0,
  },

  summary: {
    type: String,
    required: [true, "Summary of the tour is required!"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Description of the tour is required!"],
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, "Tour must have a cover image"],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now()
  },

  startDate: [Date],

  // locations: {

  // }
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
