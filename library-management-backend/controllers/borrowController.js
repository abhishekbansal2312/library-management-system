const BorrowRecords = require("../models/BorrowBook");

const getBorrowRecords = async (req, res) => {
  try {
    const borrowRecords = await BorrowRecords.find().populate("book user");
    res.json(borrowRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching borrow records" });
  }
};

module.exports = { getBorrowRecords };
