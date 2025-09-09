const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product"); // Assuming Product model is available
const sendEmail = require("../utils/sendEmail"); // Import sendEmail utility
const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email phoneNumber").populate("items.product", "name price").sort({ createdAt: -1 }); // Added phoneNumber
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "email phoneNumber"); // Populate user email and phone number

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Send email notification
    if (order.user && order.user.email) {
      const subject = `Order Status Update: Your Order #${order._id} is now ${status}`;
      const message = `
        <p>Dear Customer,</p>
        <p>Your order status has been updated.</p>
        <p>Order ID: <strong>${order._id}</strong></p>
        <p>New Status: <strong>${status}</strong></p>
        <p>Thank you for shopping with us!</p>
      `;
      await sendEmail({ email: order.user.email, subject, message });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete order and update product quantities
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product,
        { $inc: { stock: item.quantity } } // Assuming a 'stock' field in Product model
      );
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully and product quantities updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
