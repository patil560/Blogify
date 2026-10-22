const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true, maxlength: 100 },
  status: { type: String, enum: ["PENDING", "RESOLVED", "REJECTED"], default: "PENDING", index: true }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model("Report", schema);
