const router=require("express").Router();
const {update,remove}=require("../controllers/comments");
const {requireAuth}=require("../middleware/auth");
const {validate}=require("../middleware/validate");
const {commentSchema}=require("../validators/schemas");
router.patch("/:id",requireAuth,validate(commentSchema),update);
router.delete("/:id",requireAuth,remove);
module.exports=router;
