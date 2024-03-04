const express=require("express");
const router=express.Router();
const meat=require("../models/meat");
router.get("/",(req,res)=>{
    meat.find({}).then(response=>{
        res.render("user/meat",{data:response});
    })
})
module.exports=router;