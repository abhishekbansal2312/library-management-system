const express = require("express");
const router = express.Router();

const {
  getAuthors,
  getAuthorById,
  createAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

router.get("/", getAuthors);

router.post("/", verifyToken, verifyAdmin, createAuthor);

router.get("/:id", getAuthorById);

router.delete("/:id", verifyToken, verifyAdmin, deleteAuthor);

module.exports = router;
