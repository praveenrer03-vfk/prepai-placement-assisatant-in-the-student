import express from "express";
import User from "../models/User.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// GET profile
router.get("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE profile
router.put("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const { name, email, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, email, profilePhoto },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE photo
router.put("/profile/:userId/photo", authenticateToken, async (req, res) => {
  try {
    const { profilePhoto } = req.body;

    await User.findByIdAndUpdate(req.params.userId, { profilePhoto });

    res.json({ message: "Photo updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE photo
router.delete("/profile/:userId/photo", authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { profilePhoto: null });

    res.json({ message: "Photo removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; // ✅ MUST ADD THIS