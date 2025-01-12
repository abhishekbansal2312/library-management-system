const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  publishedDate: { type: Date },
  genre: { type: String },
  price: { type: Number, required: true, min: 0 },
  // assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

BookSchema.post("save", async function (book) {
  try {
    // if (!this.isModified("author")) {
    //   console.log("Author field not modified, exiting...");
    //   return; // Exit early if the author field was not modified
    // }
    const Author = mongoose.model("Author");
    const author = await Author.findById(book.author);

    if (author) {
      await Author.findByIdAndUpdate(
        book.author,
        { $addToSet: { books: book._id } },
        { new: true }
      );
      console.log("Book is added to author", book);
    } else {
      console.error("Author not found");
    }
  } catch (err) {
    console.error("Error here", err.message);
  }
});

module.exports = mongoose.model("Book", BookSchema);
