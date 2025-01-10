const express = require("express");
const router = express.Router();

const {
  getBooks,
  insertBook,
  getBookById,
  deleteBook,
} = require("../controllers/bookController");

router.get("/", getBooks);

router.post("/", insertBook);

router.get("/:id", getBookById);

router.delete("/:id", deleteBook);

module.exports = router;
