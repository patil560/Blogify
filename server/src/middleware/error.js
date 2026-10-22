const env = require("../config/env");
function notFound(req, res) { res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }); }
function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return next(err);
  if (err.code === "LIMIT_FILE_SIZE") return res.status(400).json({ success: false, message: "Image is too large" });
  if (err.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation failed", errors: Object.values(err.errors).map(e => e.message) });
  if (err.name === "CastError") return res.status(400).json({ success: false, message: "Invalid resource ID" });
  res.status(err.statusCode || 500).json({ success: false, message: err.expose || (env.isProduction ? "Internal server error" : err.message) });
}
module.exports = { notFound, errorHandler };
