const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
   "name":String,
   "role":String,
   "email":String,
   "address":String,
   "password":String,
   "image":String
});
module.exports=mongoose.model("User",userSchema);