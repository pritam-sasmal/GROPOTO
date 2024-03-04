const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const app = express();
app.use(express.static("css"))
app.use(express.static("js"))
app.use(express.static("images"))
app.use(express.static("public/files"))
app.set("view engine", "ejs");
app.use(express.urlencoded());
const cookieparser = require("cookie-parser");
const session = require("express-session");
mongoose.connect("mongodb://127.0.0.1:27017/gropoto").then((server) => {
    console.log("database connected");
}).catch((err) => {
    console.log("error", err);
})
const User = require("./models/userModel");
const oneday=1000*24*60*60;
app.use(cookieparser());
app.use(session({
    saveUninitialized: false,
    resave: true,
    secret:'sdjvbh@wdbk',
    cookie:{maxAge:oneday}
}));
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.render("user/index");
})
const getstarted=require("./routing/getstarted");
app.use("/allproducts",getstarted);

const vegetables=require("./routing/vegetables");
app.use("/vegetables",vegetables);
const meat=require("./routing/meat");
app.use("/meat",meat);
const juice=require("./routing/juice");
app.use("/juice",juice);
const fruits=require("./routing/fruits");
app.use("/fruits",fruits);

const add=require("./routing/addproduct");
app.use("/add",auth,add);
function auth(req,res,next){
    if(req.session.email && req.session.password){
        next();
    }
    else{
        res.redirect("/login");
    }
}

app.get("/", (req, res) => {
    //res.render("index");
    if(req.session.email && req.session.password){
        res.render("user/user",{name:req.session.name})
    }
    else{
        res.render("user/index");
    }
})
const addtocart=require("./routing/addtocart");
app.use("/addtocart",addtocartauth,addtocart);
function addtocartauth(req,res,next){
    if(req.session.email && req.session.password){
        next();
    }
    else{
        res.redirect("/login");
    }
}

const profile=require("./routing/profile");
app.use("/profile",profileauth,profile);
function profileauth(req,res,next){
    if(req.session.email && req.session.password){
        next();
    }
    else{
        res.redirect("/login");
    }
}
app.get("/login", (req, res) => {
    //res.render("login",{alert:""});
    if(req.session.email && req.session.password){
        res.redirect("/");
    }
    else{
        res.render("user/login",{alert:""});
    }
})
app.post("/login", (req, res) => {
    User.find({ $and: [{ email: req.body.email }, { password: req.body.password }] }).then((response) => {
        if(response.length==0){
            res.render("user/login",{alert:"invalid email or password"});
        }
        else{
            req.session.name=response[0].name;
            req.session.email=response[0].email;
            req.session.password=response[0].password;
            req.session.role=response[0].role;
            res.render("user/user",{name:req.session.name});
        }
    })
})

app.get("/signup", (req, res) => {
    res.render("user/signup");
})
app.post("/signup", (req, res) => {
    const {name,email,role,password,address}=req.body;
    const obj = {
        name,
        password,
        email,
        role,
        address
    }
    const userObj = new User(obj);
    userObj.save().then((response) => {
        req.session.name=req.body.name;
        req.session.email=req.body.email;
        req.session.password=req.body.password;
        req.session.role=req.bodydropdown;
        res.render("user/user",{name:req.session.name});
    })
})
app.listen(3000, (err) => {
    if (err) {
        console.log("error occured");
    }
    else {
        console.log("server started");
    }
})