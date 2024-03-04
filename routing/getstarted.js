const express=require("express");
const router=express.Router();
const Allproducts=require("../models/allProduct");
router.get("/",(req,res)=>{
    Allproducts.find({}).then(response=>{
        res.render("user/getstarted",{data:response});
    })
})
module.exports=router;