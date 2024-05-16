const express = require("express");
const router = express.Router();
const Cartproduct = require("../models/addtocart");
const allproducts = require("../models/allProduct");
router.use(express.json());
router.post("/", async (req, res) => {
    try {
       // console.log(req.body);
        const productId = req.body.pid;
         const product = await allproducts.findOne({ pid: productId });

        // if (!product) {
        //     return res.status(400).json({message:"Product not found"});
        // }

        const existingCart = await Cartproduct.findOne({ email: req.session.email });

        if (existingCart) {

            let isProductInCart = false;

            // Check if the product already exists in the cart
            for (let i = 0; i < existingCart.products.length; i++) {
                if (String(existingCart.products[i].pid) === String(product.pid)) {
                    isProductInCart = true;
                    break;
                }
            }

            if (isProductInCart) {
                return res.status(400).json({ message: "This product is already in the cart." });
            } else {
                existingCart.products.push({
                    pid: product.pid,
                    image: product.image,
                    name: product.name,
                    price: product.price,
                    Quantity: product.Quantity
                });
                await existingCart.save();
                return res.status(200).json({ message: "Product added to cart" });
            }
            
            

        }
        else {
            //console.log("hello");

            const newCart = new Cartproduct({
                email: req.session.email,
                products: [{
                    pid: product.pid,
                    image: product.image,
                    name: product.name,
                    price: product.price,
                    Quantity:product.Quantity
                }]
            });
            await newCart.save();
            return res.send({message: "Product added to cart"});
        }
    } catch (err) {
        console.error("Error occurred:", err);
        //res.send("Error occurred while adding product to cart");
        res.status(500).json({ message: "Error occurred while adding product to cart" });
    }
});

module.exports = router;
