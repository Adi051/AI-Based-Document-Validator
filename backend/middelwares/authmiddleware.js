const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔍 TOKEN USER ID:", decoded.userId);

    // 🔥 IMPORTANT: string -> ObjectId safe lookup
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log("❌ USER NOT FOUND IN DB FOR:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ USER FOUND:", user.email);

    req.user = user;
    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};