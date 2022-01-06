module.exports = {
  loggedInUser: (req, res, next) => {
    console.log(req.session);
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash("error", "You need to login first.");
      res.redirect("/users/login");
    }
  },
};
