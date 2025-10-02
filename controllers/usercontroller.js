const User = require("../models/user.js");

//signup form
module.exports.getSignup = (req, res) => {
  res.render("./users/signup.ejs");
}


//signnup
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "registerd successfully");
        return res.redirect("/listings");
      });
    } catch (error) {
      console.log(error.message);
      req.flash("success", `${error.message}`);
      res.redirect("/signup");
    }
  }


  //login form
  module.exports.getLogin = (req, res) => {
  res.render("./users/login.ejs");
}


//login
module.exports.login = async (req, res) => {
    try {
      req.flash("success", "welcome back to borrowbasket");
      res.redirect(res.locals.redirectUrl || "/listings");
    } catch (err) {
      console.log(err);
    }
  }


//logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "you are logedout");
    res.redirect("/listings");
  });
}  