const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/usercontroller.js")

router.route("/signup")
.get( userController.getSignup)
.post(
  
  wrapAsync(userController.signup)
);

router.route("/login")
.get( userController.getLogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
)

//LOGOUT
router.get("/logout", userController.logout);

module.exports = router;
