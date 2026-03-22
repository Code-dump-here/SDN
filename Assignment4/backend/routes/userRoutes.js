const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUser, verifyAdmin } = require("../authenticate");

// Only Admin can GET all users
router.get("/users", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Any logged-in user can get their own info
router.get("/users/:id", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
