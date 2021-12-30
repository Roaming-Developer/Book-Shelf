var express = require("express");
var router = express.Router();

var User = require("../models/User");
var bcrypt = require("bcrypt");

var userObj = { name: "", email: "" };

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log(req.session.userId);
  res.render("users", { userObj });
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get("/login", (req, res, next) => {
  var error = req.flash("error")[0];
  res.render("login", { error });
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email && !password) {
    req.flash("error", "Email and Pasword Required");
    return res.redirect("/users/login");
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Email isn't registered");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Please Enter right password");
        return res.redirect("/users/login");
      }
      // Create a session
      req.session.userId = user.id;
      // userObj.name = user.name;
      // userObj.email = user.email;
      res.redirect("/users");
      console.log(req.session.userId);
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  // res.clearCookie("connect.sid");
  // userObj.email = "";
  // userObj.name = "";
  res.redirect("/");
});

module.exports = router;
