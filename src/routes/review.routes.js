const express = require("express");
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { checkValidObjectId } = require("../middlewares/ErrorHandler");
const { protectRouteMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// protectedRoutes: createReview, updateReview, deleteReview.
router.route("/").get(getAllReviews).post(protectRouteMiddleware, createReview);

router.use("/:id", checkValidObjectId);
router
  .route("/:id")
  .get(getReview)
  .patch(protectRouteMiddleware, updateReview)
  .delete(protectRouteMiddleware, deleteReview);

module.exports = router;
