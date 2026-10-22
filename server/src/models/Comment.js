const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true, versionKey: false });

commentSchema.index({ blogId: 1, createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);
