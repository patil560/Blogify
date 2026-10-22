const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["LIKE", "COMMENT", "FOLLOW"], required: true },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", default: null },
  read: { type: Boolean, default: false, index: true }
}, { timestamps: true, versionKey: false });
module.exports = mongoose.model("Notification", schema);
