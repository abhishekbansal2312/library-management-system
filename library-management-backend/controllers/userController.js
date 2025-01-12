const User = require("../models/User");
const Book = require("../models/Book");
const BorrowedBook = require("../models/BorrowBook");
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("borrowedBooks borrowedHistroy");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "borrowedBooks borrowedHistroy"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Please provide name and email" });
    }
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Please provide bookId" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.isBorrowed) {
      return res.status(400).json({
        message: "Book is already borrowed by another user",
      });
    }

    const borrowedBook = new BorrowedBook({
      user: id,
      book: bookId,
    });

    // Update book status and save
    book.isBorrowed = true;
    book.borrowedBy = id;
    await book.save();

    // Update user history
    user.borrowedBooks.push(bookId);
    user.borrowedHistroy.push(borrowedBook);
    await borrowedBook.save();
    await user.save();

    res.json({ message: "Book borrowed successfully", borrowedBook });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const returnBook = async (req, res) => {
  try {
    const { id } = req.params; // User ID
    const { bookId } = req.body; // Book ID

    if (!bookId) {
      return res.status(400).json({ message: "Please provide bookId" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.isBorrowed || book.borrowedBy.toString() !== id) {
      return res.status(400).json({
        message: "This book is not borrowed by the user",
      });
    }

    const borrowedBook = await BorrowedBook.findOne({
      book: bookId,
    });
    if (!borrowedBook) {
      return res.status(400).json({
        message: "Borrowed book record not found",
      });
    }

    borrowedBook.returnDate = Date.now();
    await borrowedBook.save();

    // Reset book status and save
    book.isBorrowed = false;
    book.borrowedBy = null;
    await book.save();

    // Remove the book from the user's borrowed list
    user.borrowedBooks.pull(bookId);
    await user.save();

    res.json({ message: "Book returned successfully", borrowedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  borrowBook,
  returnBook,
};
