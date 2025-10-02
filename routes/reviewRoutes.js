const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true }); // ti get req.id.params from app.js we use mereg params
const Review = require("../models/review.js");
const Listing = require("../models/Listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isAuthor,validateReview}= require("../middleware.js")

const reviewController = require("../controllers/reviewcontroller.js")


//reviews
//post Route
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

//delete review
router.delete(
  "/:reviewId",isLoggedIn,isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;

