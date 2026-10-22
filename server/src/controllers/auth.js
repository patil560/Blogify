const User = require("../models/User");
const { signToken } = require("../services/auth");
const { cookieOptions } = require("../utils/cookies");
const { sendSuccess } = require("../utils/api");
const { issueCsrfToken } = require("../middleware/security");

async function signup(req, res) {
  const { username, email, password } = req.body;
  const exists = await User.exists({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email is already registered" });
  const user = await User.create({ username, email, password });
  res.cookie("token", signToken(user), cookieOptions());
  issueCsrfToken(req, res);
  return sendSuccess(res, { user: user.toSafeJSON() }, 201);
}

async function signin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)) || !user.isActive) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  res.cookie("token", signToken(user), cookieOptions());
  issueCsrfToken(req, res);
  return sendSuccess(res, { user: user.toSafeJSON() });
}

function me(req, res) { return sendSuccess(res, { user: req.user ? req.user.toSafeJSON() : null }); }
function csrf(req, res) { return sendSuccess(res, { csrfToken: issueCsrfToken(req, res) }); }
function logout(req, res) { res.clearCookie("token", cookieOptions()); res.clearCookie("csrf", cookieOptions()); return sendSuccess(res); }
module.exports = { signup, signin, me, csrf, logout };
