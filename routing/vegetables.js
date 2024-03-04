const express=require("express");
const router=express.Router();
const vegetables=require("../models/vegetables");
router.get("/",(req,res)=>{
    vegetables.find({}).then(response=>{
        res.render("user/vegetables",{data:response});
    })
})
module.exports=router;