const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const { sendSuccess } = require("../utils/api");
async function update(req,res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success:false, message:"Comment not found" });
  if (comment.createdBy.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") return res.status(403).json({ success:false, message:"You cannot edit this comment" });
  comment.content = req.body.content; await comment.save();
  return sendSuccess(res,{comment});
}
async function remove(req,res) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ success:false, message:"Comment not found" });
  const blog = await Blog.findById(comment.blogId).select("createdBy");
  const allowed = comment.createdBy.toString() === req.user._id.toString() || req.user.role === "ADMIN" || blog?.createdBy.toString() === req.user._id.toString();
  if (!allowed) return res.status(403).json({ success:false, message:"You cannot delete this comment" });
  await comment.deleteOne(); return sendSuccess(res);
}
module.exports = { update, remove };
