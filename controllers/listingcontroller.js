const Listing = require("../models/Listing.js");
const { listingSchema } = require("../Schema.js");

//index route
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
  }

  //renders create form
module.exports.renderNewform = (req, res) => {
  res.render("./listings/create.ejs");
}

// show listing
module.exports.show =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({path:"reviews", populate:{
        path:"author"
      }})
      .populate("owner");
    if (!listing) {
      req.flash("failure", "Listing you are trying to access doe not exist");
      res.redirect(`/listings`);
    } else {
      res.render("./listings/show.ejs", { listing });
    }
  }
  
  //create new listing
module.exports.createNewListing =async (req, res, next) => {
  let url = req.file.path;
  let fileName= req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, fileName}
    await newlisting.save();
    req.flash("success", "new Listing created successfully");
    res.redirect(`/listings`);
  }

  //render edit route
module.exports.renderEdit =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("failure", "Listing you are trying to access doe not exist");
      res.redirect(`/listings`);
    } else {
      let originalimg = listing.image.url;
      originalimg= originalimg.replace("/upload","/upload/h_300,w_250/")
      res.render("./listings/edit.ejs", { listing, originalimg });
    }
  }

  //update listing
module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
   let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing },{new:true});
  if (!listing) {
    console.log("listing not found")
  }
   //we will check if user has uploaded file than well make change in image or ele no
   if(typeof req.file !== "undefined"){
   let url = req.file.path;
  let filename= req.file.filename;
  listing.image = { url, filename};
  await listing.save();
   }
  
    req.flash("success", "Listing updated");

    res.redirect(`/listings/${id}`);
  }

  //delete route
module.exports.deleteListing =async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect(`/listings`);
  }