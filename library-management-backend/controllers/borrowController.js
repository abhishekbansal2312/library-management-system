const BorrowRecords = require("../models/BorrowBook");

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

module.exports = { getBorrowRecords };
