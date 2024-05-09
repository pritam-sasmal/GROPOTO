const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
app.use(express.static("css"))
app.use(express.static("js"))
app.use(express.static("images"))
app.use(express.static("public/files"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("css"));
const cookieparser = require("cookie-parser");
const session = require("express-session");
mongoose.connect("mongodb://127.0.0.1:27017/gropoto").then((server) => {
    console.log("database connected");
}).catch((err) => {
    console.log("error", err);
})
const Users = require("./models/userModel");
const oneday = 1000 * 24 * 60 * 60;
app.use(cookieparser());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'sdjvbh@wdbk',
    cookie: { maxAge: oneday }
}));
app.use('*.css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
});
app.get("/logout", (req, res) => {
    //console.log("logout");
    req.session.destroy();
    res.redirect("/");
})
const getstarted = require("./routing/getstarted");
app.use("/allproducts", getstarted);
// function allproductsauth(){
//     if(req.session.email){
//         next();
//     }
//     else{
//         res.sendFile(path.join(__dirname,"./user/getstarted.html"));
//     }
// }

const admin = require("./routing/admin");
app.use("/admin", adminauth, admin);
function adminauth(req, res, next) {
    if (req.session.email && req.session.password) {
        next();
    }
    else {
        res.redirect("/login");
    }
}
function auth(req, res, next) {
    //console.log(req.session.email);
    if (req.session.email) {
        next();
    }
    else {
        res.status(201).send("Failure");
        //console.log("hi");
        // res.redirect("/login");
    }
}
const addtocart = require("./routing/addtocart");
app.use("/addtocart", auth, addtocart);
app.get("/", async (req, res) => {
    if (req.session.email && req.session.password) {
        if (req.session.email === "admin@gmail.com" && req.session.password === "1234") {
            res.sendFile(path.join(__dirname, "./admin/product.html"));
        }
        else {
            let user = await Users.find({ email: req.session.email });
            //console.log(user[0].name);
            fs.readFile(path.join(__dirname, "./user/user.html"), "utf8", (err, data) => {
                if (err) {
                    res.status(500).send("Error reading file");
                    return;
                }
                const modifiedHtml = data.replace("{username}", user[0].name);
                res.send(modifiedHtml);
            });
        }
    }
    else {
        res.sendFile(path.join(__dirname, "./user/index.html"));
    }
})
const cartproduct=require("./routing/cartproduct");
app.use("/cartproduct",cartproductauth,cartproduct);
function cartproductauth(req,res,next){
    if (req.session.email) {
        console.log("hello");
        next();
    }
    else {
        console.log("hi");
        res.status(201).send("Failure");
    }
}

const profile = require("./routing/profile");
app.use("/profile", profileauth, profile);
function profileauth(req, res, next) {
    if (req.session.email && req.session.password) {
        next();
    }
    else {
        res.status(201).send("please login");
    }
}
app.get("/signup", (req, res) => {
    res.render("signup", { message: "" });
})
app.post("/signup", async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const obj = {
        name, email, password, address, role
    }
    //console.log(obj);
    const existuser = await Users.findOne({ email: email });
    const userobj = new Users(obj);
    if (existuser) {
        res.render("signup", { message: "This email already used" });
    }
    else {
        if (obj.role === "admin") {
            if (obj.email === "admin@gmail.com" && obj.password === "1234") {
                userobj.save(obj).then(response => {
                    req.session.name = req.body.name;
                    req.session.email = req.body.email;
                    req.session.password = req.body.password;
                    req.session.address = req.body.address;
                    req.session.role = req.body.role;
                    res.redirect("/admin");
                })
            }
            else {
                res.render("signup", { message: "I think you are not admin😂" });
            }
        }
        else {
            userobj.save(obj).then(response => {
                req.session.name = req.body.name;
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.role = req.body.role;
                res.redirect("/",);
            })
        }
    }
    // let { name, email, password, address, role } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    // password = hashedPassword;
    // // Create a new user
    // const existuser = await Users.findOne({ email: email });
    // const obj = {
    //     name, email, password, address, role
    // }
    // const userobj = new Users(obj);
    // if (existuser) {
    //     res.render("signup", { message: "This email already used" });
    // }
    // else {
    //     if (obj.email === "admin@gmail.com") {
    //         res.render("signup", { message: "This email already used" });
    //     }
    //     else {
    //         userobj.save(obj).then(response => {
    //             req.session.name = req.body.name;
    //             req.session.email = req.body.email;
    //             req.session.password = password;
    //             req.session.role = req.body.role;
    //             res.redirect("/",);
    //         })
    //     }
    // }


})

app.get("/login", (req, res) => {
    res.render("login", { message: "" });
})
app.post("/login", async (req, res) => {
    //console.log("hi");
    Users.find({ $and: [{ email: req.body.email }, { password: req.body.password }] }).then((response) => {
        if (response.length == 0) {
            res.render("login", { message: "invalid email or password" });
        }
        else if (response[0].role === "admin") {
            req.session.email = response[0].email;
            req.session.password = response[0].password;
            req.session.role = response[0].role;
            res.redirect("/admin");
        }
        else {
            req.session.email = response[0].email;
            req.session.password = response[0].password;
            req.session.role = response[0].role;
            res.redirect("/");
        }
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