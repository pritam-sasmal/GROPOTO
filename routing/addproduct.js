const express = require("express");
const router = express.Router();
const Cartproduct = require("../models/addtocart");
const allproducts = require("../models/allProduct");

router.get("/:val", async (req, res) => {
    try {
        const productId = req.params.val;
        const product = await allproducts.findOne({ _id: productId });

        if (!product) {
            return res.status(404).send("Product not found");
        }

        const existingCart = await Cartproduct.findOne({ email: req.session.email });

        if (existingCart) {

            let isProductInCart = false;

            // Check if the product already exists in the cart
            for (let i = 0; i < existingCart.products.length; i++) {
                if (String(existingCart.products[i]._id) === String(product._id)) {
                    isProductInCart = true;
                    break;
                }
            }

            if (isProductInCart) {
                
                 res.send('<script>alert("This product already added.")</script>');
            } else {
                existingCart.products.push({
                    _id: product._id,
                    discount: product.discount,
                    image: product.image,
                    name: product.name,
                    price: product.price
                });
                await existingCart.save();
                return res.send("Product added to cart");
            }

        }
        else {

            const newCart = new Cartproduct({
                email: req.session.email,
                products: [{
                    _id: product._id,
                    discount: product.discount,
                    image: product.image,
                    name: product.name,
                    price: product.price
                }]
            });
            await newCart.save();
            return res.send("Product added to cart");
        }
    } catch (err) {
        console.error("Error occurred:", err);
        res.send("Error occurred while adding product to cart");
    }
});

module.exports = router;
