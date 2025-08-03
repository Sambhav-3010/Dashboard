const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Create product
router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const newProduct = new Product({ ...req.body, images: imageUrls });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put("/:id", upload.array("images", 4), async (req, res) => {
  try {
    let imageUrls;
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updateData = { ...req.body };
    if (imageUrls) updateData.images = imageUrls;
    updateData.updatedAt = new Date();

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;