const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const Listing = require("../models/Listing.js");
const listingController = require("../controllers/listingcontroller.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage }) //multer will store our image file in storage of coudinary


router
.route("/")
.get(
  wrapAsync(listingController.index))
 
  .post(isLoggedIn,
  validateListing,
  upload.single('listing[image]'),
  wrapAsync(listingController.createNewListing)
);




//direct to create page
router.get("/news", isLoggedIn, listingController.renderNewform);

router.route("/:id")
.get(
  
  wrapAsync(listingController.show)
)
.put(
 isLoggedIn,
  isOwner,
  
  validateListing,
  upload.single('listing[image]'),
  wrapAsync(listingController.updateListing)
)
.delete(
  
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);






//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEdit)
);




module.exports = router;
