const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/expresserror");

// Middleware: Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in to do that!");
    return res.redirect("/login");
  }
  next();
};

// Middleware: Save redirect URL if exists
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl; // clear after using
  }
  next();
};

// Middleware: Check if current user is the owner of a listing
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curruser._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Middleware: Validate listing input using Joi schema
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errmsg, 400);
  } else {
    next();
  }
};

// Middleware: Validate review input using Joi schema
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(errmsg, 400);
  } else {
    next();
  }
};

// Middleware: Check if current user is the author of a review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewid } = req.params;
  const foundReview = await Review.findById(reviewid);
  if (!foundReview.author.equals(res.locals.curruser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


