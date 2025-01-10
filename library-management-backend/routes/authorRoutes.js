const express = require("express");
const router = express.Router();

const {
  getAuthors,
  getAuthorById,
  createAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

router.get("/", getAuthors);

router.post("/", createAuthor);

router.get("/:id", getAuthorById);

router.delete("/:id", deleteAuthor);

module.exports = router;
