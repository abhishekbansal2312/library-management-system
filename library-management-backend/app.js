const express = require("express");
const app = express();
const mongoose = require("./db");
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

app.listen(port, () => {
  console.log("Server is running on port http://localhost:3000");
});
