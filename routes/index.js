var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/protected", (req, res, next) => {
  console.log(req.session);

  if (req.session && req.session.userId) {
    res.send("PROTECTED CONTENT");
  } else {
    res.redirect("/users/login");
  }
});

module.exports = router;
