const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, trim: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  borrowedHistroy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "BorrowedBook" },
  ],
});

module.exports = mongoose.model("User", UserSchema);
