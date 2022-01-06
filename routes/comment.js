var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Comment = require("../models/comment");

router.get("/:id/edit", (req, res, next) => {
  // Redirect to Edit comment page
  var commentId = req.params.id;
  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.render("editCommentForm", { comment: comment });
  });
});

router.post("/:id/", (req, res, next) => {
  // update with new content
  var commentId = req.params.id;
  Comment.findByIdAndUpdate(commentId, req.body, (err, updatedComment) => {
    res.redirect("/books/" + updatedComment.bookId);
  });
});

router.get("/:id/delete", (req, res, next) => {
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
