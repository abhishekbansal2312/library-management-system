const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userInfo) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired access token" });
    }
    req.userInfo = userInfo;
    next();
  });
};

const authorizeBorrowReturn = (req, res, next) => {
  const { userId, role } = req.userInfo;
  const ownerId = req.params.id;
  console.log(userId, ownerId, role);

  if (role === "admin" || userId === ownerId) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Access denied. Insufficient privileges." });
};

const verifyAdmin = (req, res, next) => {
  const { role } = req.userInfo;
  console.log(req.userInfo);

  if (role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = {
  verifyToken,
  authorizeBorrowReturn,
  verifyAdmin,
};
