const express=require("express");
const router=express.Router();
const path=require("path");
router.use(express.static("css"));
router.use(express.static("public/files"));
router.use(express.json());
const fs=require("fs");
const users = require("../models/userModel");
const Allproducts=require("../models/allProduct");
router.get("/",(req,res)=>{
    Allproducts.find({}).then(response=>{
        res.json(response);
    })
})
router.get("/getstarted",async(req,res)=>{
    let isLoggedIn = false;
    let username = "";
    if (req.session.email) {
        isLoggedIn = true;
        const responseData = await users.findOne({ email: req.session.email });
        username = responseData ? responseData.name : "";
        fs.readFile(path.join(__dirname, "../user/logingetstarted.html"), "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Error reading file");
                return;
            }
            let modifiedHtml = data.replace('<a href="/profile" class="fas fa-user-circle"></a>', `<a href="/profile" class="name">${username}</a>`);
            modifiedHtml = modifiedHtml.replace('<a href="/login" class="login-button">Login</a>', '<a href="/logout" class="login-button">Logout</a>');
    
            // Send the modified HTML as response
            res.send(modifiedHtml);
        });
    }
    else{
        res.sendFile(path.join(__dirname,"../user/getstarted.html"));
    }
})
module.exports=router;