const router=require("express").Router();
const {profile,bookmarks,notifications,markNotificationsRead}=require("../controllers/user");
const {requireAuth}=require("../middleware/auth");
router.get("/profile/:id",profile);
router.get("/bookmarks",requireAuth,bookmarks);
router.get("/notifications",requireAuth,notifications);
router.patch("/notifications/read",requireAuth,markNotificationsRead);
module.exports=router;
