const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret123";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const actualToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(actualToken, JWT_SECRET);

    // ✅ FIXED STRUCTURE
    req.user = {
      _id: decoded.id
    };

    next();

  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;