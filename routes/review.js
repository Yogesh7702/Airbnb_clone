const express = require("express");
const router = express.Router({ mergeParams: true }); 
const wrapAsync = require("../utils/wrapasync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middlewear");

 const reviewController = require("../controllers/review.js");

//                    POST review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//                 DELETE review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;

