const express = require("express");
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
} = require("../controllers/tour.controller");

const router = express.Router();

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
