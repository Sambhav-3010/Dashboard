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

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

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

// Update product (replace images)
router.put("/:id", upload.array("images", 4), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // If no new files uploaded, reject update
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "New images are required for update" });
    }

    // Delete old images from disk
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const imagePath = path.join(__dirname, "..", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    // Save new images
    const newImageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    const updateData = {
      ...req.body,
      images: newImageUrls,
      updatedAt: new Date(),
    };

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({message: "Product updated successfully", product: updated});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Delete product and its images
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const imagePath = path.join(__dirname, "..", imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product and images deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
