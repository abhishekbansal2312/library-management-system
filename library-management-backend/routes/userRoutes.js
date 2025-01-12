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
const {
  verifyToken,
  authorizeBorrowReturn,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.get("/", getUsers);

router.get("/:id", verifyToken, getUserById);
router.post("/", verifyToken, verifyAdmin, createUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
router.put("/:id/borrow", verifyToken, authorizeBorrowReturn, borrowBook);
router.put("/:id/return", verifyToken, authorizeBorrowReturn, returnBook);

module.exports = router;
