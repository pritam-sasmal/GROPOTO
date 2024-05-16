const express = require("express");
const router = express.Router();
const path=require("path");
const fs=require("fs");
const users = require("../models/userModel");
const multer = require("multer");
router.use(express.static("../public/images"));


router.get("/", async (req, res) => {
    try {
        const responseData = await users.findOne({ email: req.session.email });
        fs.readFile(path.join(__dirname, "../user/profile.html"), "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Error reading file");
                return;
            }
            // console.log(responseData.image);
            // console.log(responseData.name);
            let modifiedHtml = data.replace("username[0].name", responseData.name);
            modifiedHtml = modifiedHtml.replace("username[0].email", responseData.email);
            modifiedHtml = modifiedHtml.replace("username[0].address", responseData.address);
            modifiedHtml = modifiedHtml.replace("username[0].image", responseData.image);
            //console.log(responseData.image);
            // Send the modified HTML as response
            res.send(modifiedHtml);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
