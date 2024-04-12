const express = require("express");
const mongoose = require("mongoose");

const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  getMonthlyPlan,
} = require("../controllers/tour.controller");

const { checkValidObjectId } = require("../middlewares/ErrorHandler");

const router = express.Router();

router.route("/").get(getAllTours).post(createTour);

router.use("/:id", checkValidObjectId);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

router.route("/monthly-plan/:id").get(getMonthlyPlan);

module.exports = router;
