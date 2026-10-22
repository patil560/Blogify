const env = require("../config/env");
function cookieOptions() {
  return { httpOnly: true, secure: env.isProduction, sameSite: env.isProduction ? "none" : "lax", maxAge: 24 * 60 * 60 * 1000, path: "/" };
}
module.exports = { cookieOptions };
