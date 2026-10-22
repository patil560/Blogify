const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
  body: { type: String, required: true, minlength: 20, maxlength: 50000 },
  coverImageUrl: { type: String, default: "https://placehold.co/1200x630?text=Blog" },
  coverImagePublicId: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  status: { type: String, enum: ["DRAFT", "PUBLISHED"], default: "PUBLISHED", index: true },
  category: { type: String, trim: true, maxlength: 40, default: "General", index: true },
  tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true, versionKey: false });

blogSchema.index({ createdAt: -1 });
blogSchema.index({ title: "text", body: "text", tags: "text" });

module.exports = mongoose.model("Blog", blogSchema);
