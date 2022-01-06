var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Comment = require("../models/comment");

var auth = require("../middlewares/auth");

// Protected
router.get("/:id/edit", auth.loggedInUser, (req, res, next) => {
  // Redirect to Edit comment page
  var commentId = req.params.id;
  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.render("editCommentForm", { comment: comment });
  });
});

// Protected
router.post("/:id/", auth.loggedInUser, (req, res, next) => {
  // update with new content
  var commentId = req.params.id;
  Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
    res.redirect("/books/" + updatedComment.bookId);
  });
});

// Protected
router.get("/:id/delete", auth.loggedInUser, (req, res, next) => {
  var commentId = req.params.id;
  Comment.findByIdAndRemove(commentId, (err, comment) => {
    if (err) return next(err);
    Book.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment._id } },
      (err, book) => {
        if (err) return next(err);
        res.redirect("/books/" + comment.bookId);
      }
    );
  });
});

module.exports = router;
