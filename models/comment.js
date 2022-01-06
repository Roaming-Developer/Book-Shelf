var mongoos = require("mongoose");
var Schema = mongoos.Schema;

var commentSchema = new Schema(
  {
    content: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

var Comment = mongoos.model("Comment", commentSchema);

module.exports = Comment;
