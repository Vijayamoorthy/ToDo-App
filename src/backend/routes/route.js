const express=require("express")
const router=express.Router();

 const {redirectprofile, loginPost, registerPost, logoutPost,signin,editdata,donetodo,deltodo,editbar,signup,Profile, redirectlogin,addtodo}=require("../controllers/controller");

// const {addtodo,editdata,deltodo,editbar,donetodo}=require("../controllers/maincontroller");



router.get("/",redirectlogin,Profile);

router.get("/signin",redirectprofile,signin);

router.post("/signin",redirectprofile,loginPost);

router.get("/signup",redirectprofile,signup);

router.post("/signup",redirectprofile,registerPost);

//router.post("/add",add);

router.post("/signout",redirectlogin,logoutPost);

 router.post("/add",addtodo);
 router.post("/delete",deltodo);
 router.post("/editbar",editbar);
 router.post("/editdata",editdata);
 router.post("/done",donetodo);



module.exports=router;
