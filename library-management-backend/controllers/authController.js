const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ userId: user._id }, secret, { expiresIn });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Please provide a valid name or email" });
    }

    const user = await User.findOne({ $or: [{ name }, { email }] });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET,
      "1d"
    );
    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET,
      "7d"
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    console.log("Refresh token found:", refreshToken);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.error("Error verifying refresh token:", err);
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      console.log("User from refresh token:", user);

      const newAccessToken = generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        "1d"
      );
      res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error); // Log any other unexpected errors
    res.status(500).json({ message: "Error refreshing access token", error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = { register, login, logout, refreshAccessToken };
