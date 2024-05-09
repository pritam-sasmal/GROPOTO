const express = require("express");
const router = express.Router();
const path=require("path");
const fs=require("fs");
const users = require("../models/userModel");
const multer = require("multer");

// Assuming 'views' and 'css' folders are at the same level
// router.use(express.static("../views"));
// router.use(express.static("../css"));

router.get("/", async (req, res) => {
    try {
        const responseData = await users.findOne({ email: req.session.email });
        fs.readFile(path.join(__dirname, "../user/profile.html"), "utf8", (err, data) => {
            if (err) {
                res.status(500).send("Error reading file");
                return;
            }
            let modifiedHtml = data.replace("username[0].name", responseData.name);
            modifiedHtml = modifiedHtml.replace("username[0].email", responseData.email);
            modifiedHtml = modifiedHtml.replace("username[0].address", responseData.address);

            // Send the modified HTML as response
            res.send(modifiedHtml);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

const mstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/files");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
const upload = multer({ storage: mstorage });

router.post("/upload", upload.single("pic"), async (req, res) => {
    try {
        const x = `${req.file.originalname}`;
        const user = await users.findOne({ email: req.session.email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.image = x;
        await user.save();

        const responseData = await users.findOne({ email: req.session.email });
        console.log(responseData);
        res.render("user/profile", { data: responseData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
