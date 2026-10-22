const { verifyToken } = require("../services/auth");
const User = require("../models/User");
const { asyncHandler } = require("../utils/api");

const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (user && user.isActive) req.user = user;
  } catch (_) {}
  next();
});

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, message: "Authentication required" });
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "Admin access required" });
  next();
}
module.exports = { authenticate, requireAuth, requireAdmin };
