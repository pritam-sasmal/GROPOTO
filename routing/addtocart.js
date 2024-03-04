const express = require("express");
const router = express.Router();
const Cartproduct = require("../models/addtocart");
const allproducts = require("../models/allProduct");

router.get("/", (req, res) => {
    Cartproduct.find({ email: req.session.email })
        .then((response) => {
            if (!response || response.length === 0) {
                res.render("user/login", { alert: "Please login to view this page" });
            }

            if (response[0].products.length === 0) {
                res.send("Products empty");
            } else {
                // Adjust how you pass the objects to res.render
                res.render("addtocart", {
                    name: req.session.name,
                    product: response[0].products // Assuming the products are stored within response[0].product
                });
            }
        })
        .catch((error) => {
            console.error("Error occurred:", error);
            res.status(500).send("Error occurred while fetching cart data");
        });
});

module.exports = router;