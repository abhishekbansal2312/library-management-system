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
      return res.status(400).json({ message: "Please provide bookId" }); // book id is required
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // user id is required
    }

    const book = await Book.findById(bookId); // find book id
    if (!book) {
      return res.status(404).json({ message: "Book not found" }); // book id is required
    }
    if (user.borrowedBooks.includes(bookId)) {
      return res.status(400).json({ message: "Book already borrowed" }); // book is already borrowed
    }
    const prevborrowedBook = await BorrowedBook.findOne({
      // find previous borrowed book
      user: id,
      book: bookId,
    });
    console.log();

    if (!prevborrowedBook.returnDate) {
      return res.status(400).json({
        message: "Book is already borrowed previously and not returned",
      });
    }

    const borrowedBook = new BorrowedBook({
      user: id,
      book: bookId,
    });

    user.borrowedHistroy.push(borrowedBook);
    await borrowedBook.save();

    user.borrowedBooks.push(bookId);

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

    // Validate request body
    if (!bookId) {
      return res.status(400).json({ message: "Please provide bookId" });
    }

    // Fetch user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the book is in the user's borrowed list
    if (!user.borrowedBooks.includes(bookId)) {
      return res
        .status(400)
        .json({ message: "This book was not borrowed by the user" });
    }

    // Fetch the borrowed book record
    const borrowedBook = await BorrowedBook.findOne({
      user: id,
      book: bookId,
      returnDate: null,
    });
    if (!borrowedBook) {
      return res
        .status(400)
        .json({ message: "Borrowed book record not found" });
    }

    // Check if the book has already been returned
    if (borrowedBook.returnDate) {
      return res
        .status(400)
        .json({ message: "Book has already been returned" });
    }

    borrowedBook.returnDate = Date.now();
    await borrowedBook.save(); // Save the updated borrowed book record

    user.borrowedBooks.pull(bookId); // Remove book from user's borrowed list
    await user.save(); // Save updated user record

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
