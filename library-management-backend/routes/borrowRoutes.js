const express = require("express");
const router = express.Router();

const {
  getBorrowRecords,
  getUserBorrowedBooks,
} = require("../controllers/borrowController");
const { verifyAdmin, verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, verifyAdmin, getBorrowRecords);

router.get("/:userId/borrowedBooks", verifyToken, getUserBorrowedBooks);

module.exports = router;
