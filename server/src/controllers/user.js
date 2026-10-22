const Blog = require("../models/Blog");
const Bookmark = require("../models/Bookmark");
const Notification = require("../models/Notification");
const { sendSuccess } = require("../utils/api");
async function profile(req,res) {
  const user = await require("../models/User").findById(req.params.id).select("username email profileImageUrl role createdAt");
  if (!user) return res.status(404).json({success:false,message:"User not found"});
  const blogs = await Blog.find({createdBy:user._id,status:"PUBLISHED"}).sort({createdAt:-1}).limit(20).lean();
  return sendSuccess(res,{user:user.toSafeJSON(),blogs});
}
async function bookmarks(req,res) {
  const items = await Bookmark.find({user:req.user._id}).populate({path:"blog",populate:{path:"createdBy",select:"username profileImageUrl"}}).sort({createdAt:-1}).lean();
  return sendSuccess(res,{blogs:items.map(i=>i.blog).filter(Boolean)});
}
async function notifications(req,res) {
  const items = await Notification.find({recipient:req.user._id}).populate("actor","username profileImageUrl").populate("blog","title").sort({createdAt:-1}).limit(50).lean();
  return sendSuccess(res,{notifications:items});
}
async function markNotificationsRead(req,res) { await Notification.updateMany({recipient:req.user._id,read:false},{read:true}); return sendSuccess(res); }
module.exports = { profile, bookmarks, notifications, markNotificationsRead };
