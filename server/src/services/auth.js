const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, { expiresIn: "1d" });
}
function verifyToken(token) { return jwt.verify(token, env.JWT_SECRET); }
module.exports = { signToken, verifyToken };
