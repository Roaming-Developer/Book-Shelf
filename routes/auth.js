var express = require("express");
var router = express.Router();
var passport = require("passport");
// require("dotenv").config();

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    // req.session.userId = user.id;
    // console.log(req);
    res.redirect("/");
  }
);

module.exports = router;
