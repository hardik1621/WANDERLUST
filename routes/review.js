const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const {validateReview, isLoggedIn, isReviewAuthor, savedredirectUrl}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//Review Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.post));

//Review Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.delete));

module.exports=router;