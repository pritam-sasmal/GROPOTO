const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    email: String,
    products: [
        {
            "pid": String,
            "name": String,
            "price": String,
            "Quantity": String,
            "image": String
        }
    ]
}, { timestamps: true });
const cartModel = mongoose.model("Cartproduct", cartSchema);
module.exports = cartModel;