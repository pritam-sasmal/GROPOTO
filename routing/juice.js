const express=require("express");
const router=express.Router();
const meat=require("../models/juice");
router.get("/",(req,res)=>{
    meat.find({}).then(response=>{
        res.render("user/juice",{data:response});
    })
})
module.exports=router;