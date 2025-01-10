const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  borrowBook,
  returnBook,
} = require("../controllers/userController");

router.get("/", getUsers);

router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id/borrow", borrowBook);
router.put("/:id/return", returnBook);

module.exports = router;
