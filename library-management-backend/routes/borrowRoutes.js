const express = require("express");
const router = express.Router();

const { getBorrowRecords } = require("../controllers/borrowController");

router.get("/", getBorrowRecords);

module.exports = router;
