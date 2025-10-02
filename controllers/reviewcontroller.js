const Review = require("../models/review.js");
const Listing = require("../models/Listing.js");


///create review
module.exports.postReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
     
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
     req.flash("success"," review added");

    res.redirect(`/listings/${listing._id}`);
  }

  
//delete review  
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    // $pull operator removes from an exiting array instances of a value or values that matches a specified condition
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // this line delete reviews from listing reviews array
    await Review.findByIdAndDelete(reviewId); // thi line delete reviews from reviews collection
 req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
  }