var express = require("express");
var router = express.Router();

var Book = require("../models/book");
var Comment = require("../models/comment");

// Router for Book
router.get("/", (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.render("books", { books: books });
  });
});

router.get("/new", (req, res, next) => {
  res.render("addBook");
});

router.post("/", (req, res, next) => {
  // Save it to db
  Book.create(req.body, (err, createdBook) => {
    // console.log(err, createdBook);
    if (err) return next(err);
    res.redirect("/books");
  });
});

// router.get("/:id", (req, res, next) => {
//   var bookId = req.params.id;
//   Book.findById(bookId, (err, book) => {
//     if (err) return next(err);
//     res.render("bookdetails", { book: book });
//   });
// });

// Fetching book details along with comment(Association)
// router.get("/:id", (req, res, next) => {
//   var bookId = req.params.id;
//   Book.findById(bookId, (err, book) => {
//     if (err) return next(err);
//     // res.render("bookdetails", { book: book });
//     Comment.find({ bookId: bookId }, (err, comments) => {
//       if (err) return next(err);
//       res.render("bookdetails", { book, comments });
//     });
//   });
// });

// Fetching book details along with comment (Populate)
router.get("/:id", (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId)
    .populate("comments") //Will fetch whole document using ObjectId
    .exec((err, book) => {
      if (err) return next(err);
      // res.send(book);
      res.render("bookdetails", { book });
    });
});

router.get("/:id/edit", (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    res.render("editBookForm", { book: book });
  });
});

router.post("/:id", (req, res, next) => {
  var bookId = req.params.id;
  Book.findByIdAndUpdate(bookId, req.body, (err, updatedBook) => {
    if (err) return next(err);
    res.redirect("/books/" + bookId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var bookId = req.params.id;
  Book.findByIdAndDelete(bookId, (err, book) => {
    if (err) return next(err);
    Comment.deleteMany({ bookId: book.id }, (err, book) => {
      if (err) return next(err);
      res.redirect("/books");
    });
  });
});

// Comment and Book Routes

router.post("/:id/comments", (req, res, next) => {
  var bookId = req.params.id;
  req.body.bookId = bookId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Book.findByIdAndUpdate(
      bookId,
      { $push: { comments: comment._id } },
      (err, comment) => {
        if (err) return next(err);
        res.redirect("/books/" + bookId);
      }
    );
  });
});

module.exports = router;
