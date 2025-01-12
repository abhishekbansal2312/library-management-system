const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  refreshAccessToken,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/logout", logout);

router.post("/refreshtoken", refreshAccessToken);

module.exports = router;
