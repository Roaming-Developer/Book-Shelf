var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
require("dotenv").config();
require("./modules/passport");

var session = require("express-session");
var MongoStore = require("connect-mongo");

var flash = require("connect-flash");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bookRouter = require("./routes/books");
var commentRouter = require("./routes/comment");
var authRouter = require("./routes/auth");

var auth = require("./middlewares/auth");

var app = express();

mongoose.connect(
  process.env.MONGODBURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("Connected with [mongodb]", err ? false : true);
    console.log("ctrl + click -> " + "http://localhost:3000/");
  }
);

// user?retryWrites=true&w=majority

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODBURL }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(auth.userInfo);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/books", bookRouter);
app.use("/comment", commentRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
