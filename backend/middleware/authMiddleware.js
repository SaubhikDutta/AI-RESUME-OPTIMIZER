const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded); // 🔥 DEBUG

    // ✅ THIS IS THE FIX
    req.user = {
      id: decoded.id || decoded._id
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json({ msg: "Token invalid" });
  }
};