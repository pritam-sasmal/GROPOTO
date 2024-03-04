const mongoose=require("mongoose");
const cartSchema=new mongoose.Schema({
    email:String,
    products:[
        {   
            _id:String,
            discount:String,
            image:String,
            name:String,
            price:String
        }
    ]
},{timestamps:true});
const cartModel=mongoose.model("Cartproduct",cartSchema);
module.exports=cartModel;