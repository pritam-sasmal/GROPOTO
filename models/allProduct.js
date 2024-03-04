const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
   discount:String,
   image:String,
   name:String,
   price:String
});
module.exports=mongoose.model("allproduct",userSchema);