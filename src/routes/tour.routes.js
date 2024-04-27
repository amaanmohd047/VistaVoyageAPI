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

const {
  protectRouteMiddleware,
  restrictRouteMiddleware,
} = require("../middlewares/auth.middleware");
const { schemaValidation } = require("../middlewares/schemaValidation");
const { tourSchemaValidation } = require("../schema/tour.schama");

const { checkValidObjectId } = require("../middlewares/ErrorHandler");

const router = express.Router();

router
  .route("/")
  .get(protectRouteMiddleware, getAllTours)
  .post(
    protectRouteMiddleware,
    restrictRouteMiddleware,
    schemaValidation(tourSchemaValidation),
    createTour
  );

router.route("/monthly-plan/:id").get(getMonthlyPlan);

router.use("/:id", checkValidObjectId);
router
  .route("/:id")
  .get(getTour)
  .patch(protectRouteMiddleware, restrictRouteMiddleware, updateTour)
  .delete(protectRouteMiddleware, restrictRouteMiddleware, deleteTour);

module.exports = router;
