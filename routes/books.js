var express = require("express");
var router = express.Router();

var Book = require("../models/book");
var Comment = require("../models/comment");
var User = require("../models/User");

var auth = require("../middlewares/auth");

// Router for Book
router.get("/", (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.render("books", { books: books });
  });
});

// Protected
router.get("/new", auth.loggedInUser, (req, res, next) => {
  res.render("addBook");
});

// Protected
router.post("/", auth.loggedInUser, (req, res, next) => {
  // Save it to db
  req.body.addedBy = req.user._id;
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
    .populate("addedBy", "name email")
    .exec((err, book) => {
      if (err) return next(err);
      // res.send(book);
      res.render("bookdetails", { book });
    });
});

router.use(auth.loggedInUser);

// Protected
router.get("/:id/edit", (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    if (String(req.user._id) === String(book.addedBy._id)) {
      res.render("editBookForm", { book: book });
    } else {
      res.send("You're not authorized to perform this action");
    }
  });
});

// Protected
router.post("/:id", (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId, req.body, (err, updatedBook) => {
    if (err) return next(err);
    if (String(req.user._id) === String(updatedBook.addedBy._id)) {
      Book.findByIdAndUpdate(bookId, req.body, (err, updatedBook) => {
        res.redirect("/books/" + bookId);
      });
    } else {
      res.send("You're not authorized to perform this action");
    }
  });
});

// Protected
router.get("/:id/delete", (req, res, next) => {
  var bookId = req.params.id;
  Book.findById(bookId, (err, book) => {
    if (err) return next(err);
    if (String(req.user._id) === String(book.addedBy._id)) {
      Book.findByIdAndDelete(bookId, (err, book) => {});
      Comment.deleteMany({ bookId: book.id }, (err, book) => {
        if (err) return next(err);
        res.redirect("/books");
      });
    } else {
      res.send("You're not authorized to perform this action");
    }
  });
});

// Comment and Book Routes

// Protected
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
