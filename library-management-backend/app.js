const express = require("express");
const app = express();
const mongoose = require("./db");
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const userRoutes = require("./routes/userRoutes");
const borrowRoutes = require("./routes/borrowRoutes");

app.use(express.json());

app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/users", userRoutes);
app.use("/borrow-records", borrowRoutes);

app.listen(port, () => {
  console.log("Server is running on port http://localhost:3000");
});
