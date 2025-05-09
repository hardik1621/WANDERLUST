const Listing= require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.post=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Submitted");
    console.log("Review saved");
    res.redirect(`/listings/${listing._id}`);
};
module.exports.delete=async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews: reviewId }});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Delete");
    res.redirect(`/listings/${id}`);
};