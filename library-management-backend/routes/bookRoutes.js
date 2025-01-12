const express = require("express");
const router = express.Router();

const {
  getBooks,
  insertBook,
  getBookById,
  deleteBook,
} = require("../controllers/bookController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getBooks);

router.post("/", insertBook);

router.get("/:id", getBookById);

router.delete("/:id", deleteBook);

module.exports = router;
