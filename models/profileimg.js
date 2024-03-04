const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    "email":String,
    "image":String
});
module.exports=mongoose.model("profileimg",userSchema);