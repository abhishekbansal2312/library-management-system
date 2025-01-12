const express = require("express");
const router = express.Router();

const {
  getBooks,
  insertBook,
  getBookById,
  deleteBook,
} = require("../controllers/bookController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getBooks);

router.post("/", verifyToken, verifyAdmin, insertBook);

router.get("/:id", verifyToken, getBookById);

router.delete("/:id", verifyToken, verifyAdmin, deleteBook);

module.exports = router;
