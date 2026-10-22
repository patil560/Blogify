const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const { sendSuccess } = require("../utils/api");
async function stats(req,res) {
  const [users,blogs,comments,reports] = await Promise.all([User.countDocuments(),Blog.countDocuments(),Comment.countDocuments(),Report.countDocuments({status:"PENDING"})]);
  return sendSuccess(res,{stats:{users,blogs,comments,pendingReports:reports}});
}
async function users(req,res) { const data=await User.find().select("username email role isActive createdAt").sort({createdAt:-1}).limit(100); return sendSuccess(res,{users:data}); }
async function toggleUser(req,res) { if(req.params.id===req.user._id.toString()) return res.status(400).json({success:false,message:"You cannot disable yourself"}); const user=await User.findById(req.params.id); if(!user)return res.status(404).json({success:false,message:"User not found"}); user.isActive=!user.isActive; await user.save(); return sendSuccess(res,{user:user.toSafeJSON(),isActive:user.isActive}); }
async function reports(req,res) { const data=await Report.find().populate("reportedBy","username").populate("blog","title").sort({createdAt:-1}).limit(100); return sendSuccess(res,{reports:data}); }
async function resolveReport(req,res) { const report=await Report.findById(req.params.id); if(!report)return res.status(404).json({success:false,message:"Report not found"}); report.status=req.body.status; await report.save(); return sendSuccess(res,{report}); }
module.exports = {stats,users,toggleUser,reports,resolveReport};
