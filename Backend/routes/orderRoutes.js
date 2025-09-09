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
    )
      .populate("user", "name email phoneNumber") // Populate user name, email, and phone number
      .populate("items.product", "name price"); // Populate product name and price

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Send email notification
    if (order.user && order.user.email) {
      const itemsRows = order.items.map(
        (item) => `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd;">${item.product.name}</td>
            <td style="padding:8px; border:1px solid #ddd;">₹${item.price.toFixed(2)}</td>
            <td style="padding:8px; border:1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
      ).join("");

      const emailSubject = `Order Status Update: Your Order #${order._id} is now ${status}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color:#4CAF50;">Hi ${order.user.name || "Customer"},</h2>
          <p>Your order status has been updated!</p>
          <p>The new status for your Order ID: <strong>${order._id}</strong> is: <strong>${status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}</strong></p>
          
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>

          <table style="width:100%; border-collapse: collapse; margin-top:15px;">
            <thead>
              <tr style="background-color:#f8f8f8;">
                <th style="padding:8px; border:1px solid #ddd;">Qty</th>
                <th style="padding:8px; border:1px solid #ddd;">Product</th>
                <th style="padding:8px; border:1px solid #ddd;">Price</th>
                <th style="padding:8px; border:1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <p style="margin-top:15px;"><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>

          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} <br/>
            ${order.shippingAddress.zipCode}, ${order.shippingAddress.country} <br/>
            <strong>WhatsApp:</strong> ${order.shippingAddress.whatsappNumber}
          </p>

          <p style="margin-top:20px;">We will contact you shortly on your WhatsApp number provided above if needed.</p>
          <p>Best regards, <br/> <strong>Team Naaree Collections</strong></p>
        </div>
      `;
      let emailSent = false;
      try {
        emailSent = await sendEmail({ email: order.user.email, subject: emailSubject, html: emailBody });
        if (emailSent) {
          // console.log(`Order status update email sent to ${order.user.email} for order ${order._id}`);
        } else {
          console.error(`Failed to send order status update email for order ${order._id} to ${order.user.email}: Email utility reported failure.`);
        }
      } catch (emailError) {
        console.error(`Failed to send order status update email for order ${order._id} to ${order.user.email}:`, emailError);
      }
      order.emailSent = emailSent; // Add emailSent status to the order object for frontend
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(`Error updating order status for order ${req.params.id}:`, err);
    res.status(400).json({ error: "Failed to update order status: " + err.message });
  }
});

// Delete order and update product quantities
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phoneNumber") // Populate user name, email, and phone number
      .populate("items.product", "name price"); // Populate product name and price

    if (!order) return res.status(404).json({ error: "Order not found" });

    let emailSent = false; // Declare emailSent variable

    // Send cancellation email notification
    if (order.user && order.user.email) {
      const itemsRows = order.items.map(
        (item) => `
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px; border:1px solid #ddd;">${item.product.name}</td>
            <td style="padding:8px; border:1px solid #ddd;">₹${item.price.toFixed(2)}</td>
            <td style="padding:8px; border:1px solid #ddd;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
      ).join("");

      const emailSubject = `Order Cancellation: Your Order #${order._id} has been cancelled`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color:#FF0000;">Hi ${order.user.name || "Customer"},</h2>
          <p>We regret to inform you that your order has been cancelled by the shipper.</p>
          <p>Your Order ID: <strong>${order._id}</strong> has been cancelled.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>

          <table style="width:100%; border-collapse: collapse; margin-top:15px;">
            <thead>
              <tr style="background-color:#f8f8f8;">
                <th style="padding:8px; border:1px solid #ddd;">Qty</th>
                <th style="padding:8px; border:1px solid #ddd;">Product</th>
                <th style="padding:8px; border:1px solid #ddd;">Price</th>
                <th style="padding:8px; border:1px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <p style="margin-top:15px;"><strong>Total Amount:</strong> ₹${order.totalAmount.toFixed(2)}</p>

          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} <br/>
            ${order.shippingAddress.zipCode}, ${order.shippingAddress.country} <br/>
            <strong>WhatsApp:</strong> ${order.shippingAddress.whatsappNumber}
          </p>

          <p style="margin-top:20px;">We apologize for any inconvenience this may cause.</p>
          <p>Best regards, <br/> <strong>Team Naaree Collections</strong></p>
        </div>
      `;
      try {
        emailSent = await sendEmail({ email: order.user.email, subject: emailSubject, html: emailBody });
      } catch (emailError) {
        console.error(`Failed to send order cancellation email for order ${order._id} to ${order.user.email}:`, emailError);
      }
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product,
        { $inc: { stock: item.quantity } } // Assuming a 'stock' field in Product model
      );
    }

    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully", emailSent: emailSent });
  } catch (err) {
    console.error(`Error deleting order ${req.params.id}:`, err);
    res.status(500).json({ error: "Failed to delete order: " + err.message });
  }
});

module.exports = router;
