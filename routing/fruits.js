const express=require("express");
const router=express.Router();
const meat=require("../models/fruits");
router.get("/",(req,res)=>{
    meat.find({}).then(response=>{
        res.render("user/fruits",{data:response});
    })
})
module.exports=router;