const crypto = require("crypto");
const { cookieOptions } = require("../utils/cookies");

function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString("hex");
  res.cookie("csrf", token, { ...cookieOptions(), httpOnly: false, maxAge: 2 * 60 * 60 * 1000 });
  return token;
}
function csrfProtection(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const cookie = req.cookies.csrf;
  const header = req.get("x-csrf-token");
  if (!cookie || !header || cookie !== header) return res.status(403).json({ success: false, message: "Invalid CSRF token" });
  next();
}
module.exports = { issueCsrfToken, csrfProtection };
