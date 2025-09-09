const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords for security
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
