const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js"); // corrected naming
const Listing = require("../models/listing"); // capitalize model
const { isLoggedIn, isOwner, validateListing } =  require("../middlewear"); // fix import path & names

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage});


    //                                     INDEX & create ROUTE 

   router.route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]") , validateListing, wrapAsync(listingController.createListing));
    

 //                                        NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm );



//                                    Show , update, & delete routes

   router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put( isOwner, validateListing, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
    .delete( isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))




//                                       EDIT ROUTE 
router.get("/:id/edit", isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
