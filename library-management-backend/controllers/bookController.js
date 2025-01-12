const Book = require("../models/Book");
const Author = require("../models/Author");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author");
    if (books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const insertBook = async (req, res) => {
  try {
    const { title, author, publishedDate, genre, price } = req.body;
    if (!title || !author || !publishedDate || !genre || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let authorId;
    const checkAuthor = await Author.findOne({ name: author.name });
    if (!checkAuthor) {
      const newAuthor = new Author({
        name: author.name,
        dob: author.dob,
        nationality: author.nationality,
      });
      const savedAuthor = await newAuthor.save();
      authorId = savedAuthor._id;
    } else {
      authorId = checkAuthor._id;
    }

    const book = new Book({
      title,
      author: authorId,
      publishedDate,
      genre,
      price,
    });
    await book.save();

    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id).populate("author");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  insertBook,
  getBooks,
  getBookById,
  deleteBook,
};
