const multer = require("multer");
const env = require("../config/env");
const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, allowed.has(file.mimetype))
});
module.exports = upload;
