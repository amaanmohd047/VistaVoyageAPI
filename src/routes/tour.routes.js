const express = require("express");

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
const { schemaValidation } = require("../middlewares/schemaValidation.middleware");
const { checkValidObjectId } = require("../middlewares/ErrorHandler");

const reviewRouter = require("./review.routes")

const { tourSchemaValidation } = require("../schema/tour.schama");

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

router.use("/:tourId/reviews", reviewRouter);

router.use("/:id", checkValidObjectId);
router
  .route("/:id")
  .get(getTour)
  .patch(protectRouteMiddleware, restrictRouteMiddleware("admin"), updateTour)
  .delete(protectRouteMiddleware, restrictRouteMiddleware("admin"), deleteTour);

module.exports = router;
