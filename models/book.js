var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, default: 0 },
    author: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamp: true }
);

var Book = mongoose.model("Book", bookSchema);

module.exports = Book;
