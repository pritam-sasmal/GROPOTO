const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
   "pid":String,
   "name":String,
   "price":String,
   "Quantity":String,
   "image":String
});
module.exports=mongoose.model("allproduct",userSchema);