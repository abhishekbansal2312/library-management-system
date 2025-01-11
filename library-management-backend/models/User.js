const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  borrowedHistroy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "BorrowedBook" },
  ],
});

module.exports = mongoose.model("User", UserSchema);
