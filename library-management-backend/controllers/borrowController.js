const BorrowRecords = require("../models/BorrowBook");
const User = require("../models/User");

const getBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await BorrowRecords.find()
      .populate("book", "title author genre price")
      .populate("user", "name email");

    res.json(borrowRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrow records" });
  }
};

const getUserBorrowedBooks = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const user = await User.findById(userId).populate(
      "borrowedBooks",
      "title author genre price"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const borrowedBooks = user.borrowedBooks;

    res.json({ borrowedBooks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBorrowRecords, getUserBorrowedBooks };
