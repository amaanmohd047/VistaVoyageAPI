const express = require("express");
const {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  checkID,
  checkBody
} = require("../controllers/tour.controller");

const router = express.Router();

router.param("id", checkID);



router.route("/").get(getAllTours).post(checkBody, createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
