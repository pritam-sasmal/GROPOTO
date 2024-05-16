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
    res.sendFile(path.join(__dirname, "../user/cart.html"));

});
router.get("/", (req, res) => {
    Cartproduct.find({ email: req.session.email })
        .then((response) => {
            if (!response || response.length === 0 || !response[0].products || response[0].products.length === 0) {
                res.status(201).json([]);
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
router.post("/remove",(req,res)=>{
    const { pid } = req.body;
    Cartproduct.updateOne(
        { email: req.session.email },
        { $pull: { products: { pid: pid } } }
    )
    .then(() => {
        res.status(200).json({ message: "Item removed successfully" });
    })
    .catch((error) => {
        console.error("Error occurred while removing item from cart:", error);
        res.status(500).json({ error: "Error occurred while removing item from cart" });
    });
});
router.post("/updateCartItem", (req, res) => {
    const { pid, Quantity, price } = req.body;
    console.log(Quantity);
    console.log(price);
    Cartproduct.updateOne(
        { email: req.session.email, "products.pid": pid },
        {
            $set: {
                "products.$.Quantity": Quantity,
                "products.$.price": price
            }
        }
    )
        .then(() => {
            res.json({ message: "Cart item updated successfully" });
        })
        .catch((error) => {
            console.error("Error occurred while updating cart item:", error);
            res.status(500).json({ error: "Error occurred while updating cart item" });
        });
});



module.exports = router;
