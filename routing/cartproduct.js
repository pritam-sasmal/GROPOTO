const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
router.use(express.static("css"));
router.use(express.static("public/files"));
router.use(express.json());
const Cartproduct = require("../models/addtocart");
const allproducts = require("../models/allProduct");

router.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname,"../user/cart.html"));
    
});
router.get("/", (req, res) => {
    Cartproduct.find({ email: req.session.email })
        .then((response) => {
            if (response[0].products.length === 0) {
                res.send("Products empty");
            } else {
                fs.readFile(path.join(__dirname, "../user/cart.html"), "utf8", (err, data) => {
                    if (err) {
                        res.status(500).send("Error reading file");
                        return;
                    }
                    res.json(response[0].products);
                });
            }
        })
        .catch((error) => {
            console.error("Error occurred:", error);
            res.status(500).send("Error occurred while fetching cart data");
        });
});
module.exports = router;
