const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedredirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignupform)
  .post(wrapAsync(userController.userSignup));

router
  .route("/login")
  .get( userController.renderLoginForm)
  .post(
    savedredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.userLogin
  );

router.get("/logout", userController.userLogout);

module.exports = router;
