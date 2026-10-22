const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");
const Report = require("../models/Report");
const { uploadImage, deleteImage } = require("../services/storage");
const { sendSuccess } = require("../utils/api");

function parseTags(value) { return [...new Set(value.split(",").map(v => v.trim().toLowerCase()).filter(Boolean))].slice(0, 10); }
function serialize(blog, userId) {
  const b = blog.toObject ? blog.toObject() : blog;
  b.likeCount = b.likes?.length || 0;
  b.liked = userId ? b.likes?.some(id => id.toString() === userId.toString()) : false;
  delete b.likes;
  return b;
}

async function list(req, res) {
  const { page, limit, search, category } = req.query;
  const filter = { status: "PUBLISHED" };
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };
  const [blogs, total] = await Promise.all([
    Blog.find(filter).populate("createdBy", "username profileImageUrl").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Blog.countDocuments(filter)
  ]);
  return sendSuccess(res, { blogs: blogs.map(b => serialize(b, req.user?._id)), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
async function getById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid blog ID" });
  const blog = await Blog.findById(req.params.id).populate("createdBy", "username email profileImageUrl");
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  const comments = await Comment.find({ blogId: blog._id }).populate("createdBy", "username profileImageUrl").sort({ createdAt: -1 }).lean();
  return sendSuccess(res, { blog: serialize(blog, req.user?._id), comments });
}
async function create(req, res) {
  const image = await uploadImage(req.file);
  const blog = await Blog.create({ ...req.body, tags: parseTags(req.body.tags || ""), createdBy: req.user._id, coverImageUrl: image.url || undefined, coverImagePublicId: image.publicId });
  await blog.populate("createdBy", "username profileImageUrl");
  return sendSuccess(res, { blog: serialize(blog, req.user._id) }, 201);
}
async function update(req, res) {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  if (blog.createdBy.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "You cannot edit this blog" });
  if (req.file) {
    const image = await uploadImage(req.file);
    await deleteImage(blog.coverImagePublicId);
    blog.coverImageUrl = image.url || blog.coverImageUrl;
    blog.coverImagePublicId = image.publicId;
  }
  Object.assign(blog, req.body, { tags: parseTags(req.body.tags || "") });
  await blog.save();
  await blog.populate("createdBy", "username profileImageUrl");
  return sendSuccess(res, { blog: serialize(blog, req.user._id) });
}
async function remove(req, res) {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  if (blog.createdBy.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") return res.status(403).json({ success: false, message: "You cannot delete this blog" });
  await Promise.all([blog.deleteOne(), Comment.deleteMany({ blogId: blog._id }), Bookmark.deleteMany({ blog: blog._id }), Report.deleteMany({ blog: blog._id }), deleteImage(blog.coverImagePublicId)]);
  return sendSuccess(res);
}
async function comment(req, res) {
  const blog = await Blog.findById(req.params.id).select("createdBy");
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  const created = await Comment.create({ content: req.body.content, blogId: blog._id, createdBy: req.user._id });
  if (blog.createdBy.toString() !== req.user._id.toString()) await Notification.create({ recipient: blog.createdBy, actor: req.user._id, type: "COMMENT", blog: blog._id });
  await created.populate("createdBy", "username profileImageUrl");
  return sendSuccess(res, { comment: created }, 201);
}
async function toggleLike(req, res) {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  const index = blog.likes.findIndex(id => id.toString() === req.user._id.toString());
  if (index >= 0) blog.likes.splice(index, 1);
  else {
    blog.likes.push(req.user._id);
    if (blog.createdBy.toString() !== req.user._id.toString()) await Notification.create({ recipient: blog.createdBy, actor: req.user._id, type: "LIKE", blog: blog._id });
  }
  await blog.save();
  return sendSuccess(res, { liked: index < 0, likeCount: blog.likes.length });
}
async function toggleBookmark(req, res) {
  const blog = await Blog.exists({ _id: req.params.id });
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  const existing = await Bookmark.findOne({ user: req.user._id, blog: req.params.id });
  if (existing) { await existing.deleteOne(); return sendSuccess(res, { bookmarked: false }); }
  await Bookmark.create({ user: req.user._id, blog: req.params.id });
  return sendSuccess(res, { bookmarked: true });
}
async function report(req, res) {
  const blog = await Blog.exists({ _id: req.params.id });
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
  await Report.create({ blog: req.params.id, reportedBy: req.user._id, reason: req.body.reason });
  return sendSuccess(res, {}, 201);
}
module.exports = { list, getById, create, update, remove, comment, toggleLike, toggleBookmark, report };
