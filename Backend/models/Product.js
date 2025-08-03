const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  fabricType: String,
  regionalVarieties: String,
  price: Number,
  discounts: Number,
  sizes: [String],
  availability: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Limited"],
  },
  productType: {
    type: String,
    enum: ["saree", "suits", "boutique-fabrics", "accessories"],
  },
  shortDescription: String,
  images: [String],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);