const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const cookieparser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(express.static("css"))
app.use(express.static("js"))
app.use(express.static("images"))
app.use(express.static("public/files"))
app.use(express.static("public/images"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("css"));
app.use(cookieparser());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'sdjvbh@wdbk',
    cookie: { maxAge: 1000 * 24 * 60 * 60 }
}));
app.use('*.css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
});
mongoose.connect("mongodb://127.0.0.1:27017/gropoto").then((server) => {
    console.log("database connected");
}).catch((err) => {
    console.log("error", err);
})
const Users = require("./models/userModel");
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})
const getstarted = require("./routing/getstarted");
app.use("/allproducts", getstarted);

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
    if (req.session.email) {
        next();
    }
    else {
        res.status(201).send("Failure");
    }
}
const addtocart = require("./routing/addtocart");
app.use("/addtocart", auth, addtocart);
app.get("/", async (req, res) => {
    if (req.session.email && req.session.password) {
        if (req.session.email === "admin@gmail.com") {
            res.sendFile(path.join(__dirname, "./admin/product.html"));
        }
        else {
            let user = await Users.find({ email: req.session.email });
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
const cartproduct = require("./routing/cartproduct");
app.use("/cartproduct", cartproductauth, cartproduct);
function cartproductauth(req, res, next) {
    if (req.session.email) {
        next();
    }
    else {
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
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, './user/contact.html'));
})
app.post('/submit-contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    // Set up the nodemailer transporter
    console.log(process.env.email+" "+email);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email, 
            pass: process.env.password, 
        },
        secure: true,
    });

    // Set up the email options
    const mailOptions = {
        from: email,
        to: process.env.email,
        subject: `Contact Form Submission: ${subject}`,
        text: `You have received a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Your message has been sent successfully!');
        }
    });
});

app.get("/signup", (req, res) => {
    res.render("signup", { message: "" });
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const userEmail = req.body.email;
        cb(null, `${userEmail}.jpg`);
    }
});
const upload = multer({ storage: storage });


app.post("/signup", upload.single('image'), async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const imagePath = req.file ? req.file.path : null;
    //console.log(req.body.image);
    const hashedPassword = await bcrypt.hash(password, 10);
    const existUser = await Users.findOne({ email: email });
    if (existUser) {
        return res.render("signup", { message: "This email is already in use" });
    }
    if (role === "admin") {
        return res.render("signup", { message: "you are not admin" });
    }
    const userObj = new Users({ name, email, password: hashedPassword, address, role, image: `${email}.jpg` });
    userObj.save().then(response => {
        req.session.name = req.body.name;
        req.session.email = req.body.email;
        req.session.password = hashedPassword;
        req.session.address = req.body.address;
        req.session.role = req.body.role;
        res.redirect(userObj.role === "admin" ? "/admin" : "/");
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error saving user");
    });
});
app.get("/login", (req, res) => {
    res.render("login", { message: "" });
})
app.post("/login", async (req, res) => {
    Users.findOne({ email: req.body.email }).then((response) => {
        if (!response) {
            return res.render("login", { message: "Invalid email or password" });
        }


        bcrypt.compare(req.body.password, response.password, (err, result) => {
            if (err || !result) {
                return res.render("login", { message: "Invalid email or password" });
            }

            req.session.email = response.email;
            req.session.password = response.password;
            req.session.role = response.role;

            if (response.role === "admin") {
                res.redirect("/admin");
            } else {
                res.redirect("/");
            }
        });
    });

})
app.listen(3000, (err) => {
    if (err) {
        console.log("error occured");
    }
    else {
        console.log("server started");
    }
})