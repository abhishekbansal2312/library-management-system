const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
