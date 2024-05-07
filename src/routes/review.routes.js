const express = require("express");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { checkValidObjectId } = require("../middlewares/ErrorHandler");
const { protectRouteMiddleware, restrictRouteMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router({ mergeParams: true });

// protectedRoutes: createReview, updateReview, deleteReview.
router.route("/").get(getAllReviews).post(protectRouteMiddleware, restrictRouteMiddleware("user"), createReview);

router.use("/:id", checkValidObjectId);
router
  .route("/:id")
  .get(getReview)
  .patch(protectRouteMiddleware, restrictRouteMiddleware("user"), updateReview)
  .delete(protectRouteMiddleware, restrictRouteMiddleware("user"), deleteReview);

module.exports = router;
