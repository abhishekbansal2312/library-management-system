const express = require("express");
const app = express();
const mongoose = require("./db");
const port = 3005;
const cookieparser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
app.use(express.json());
app.use(cookieparser());

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("Server is running on port http://localhost:3005");
});
