const express = require("express");
const router = express.Router();
const product = require("../models/allProduct");
const multer = require("multer");
const path = require("path");
router.use(express.json());
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../admin/product.html"));
});

const mstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/files");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage: mstorage });

router.post("/addproduct", upload.single("image"), async (req, res) => {
  try {
    const pid = req.body.pid;
    const existingProduct = await product.findOne({ pid: pid });
    if (existingProduct) {
      return res.status(400).json({ message: "Product with the same ID already exists" });
    }
    const newProduct = new product({
      pid: pid,
      name: req.body.name,
      price: req.body.price,
      Quantity: req.body.Quantity,
      image: `${req.file.originalname}`,
    });
    await newProduct.save();
    console.log(newProduct);
    res.status(200).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/allproducts", async (req, res) => {
  try {
    const products = await product.find({});
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/deleteproduct/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    await product.deleteOne({ pid: pid });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/updateproduct", async (req, res) => {
  try {
    const obj = req.body;
    // Find the product by pid and update its fields
    const updatedProduct = await product.findOneAndUpdate(
      { pid: obj.pid },
      { name: obj.name, price: obj.price, Quantity: obj.Quantity },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
