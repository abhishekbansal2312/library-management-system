const Book = require("../models/Book");
const Author = require("../models/Author");

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().populate("books");
    if (authors.length === 0) {
      return res.status(404).json({ message: "No authors found" });
    }
    res.status(200).json(authors);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { name, dob, nationality } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Please provide name" });
    }
    const author = new Author({ name, dob, nationality });

    await author.save();
    res.status(201).json(author);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id).populate("books");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedAuthor = await Book.findByIdAndDelete(id);
    if (!deleteAuthor) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.status(204).json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  getAuthors,
  createAuthor,
  getAuthorById,
  deleteAuthor,
};
