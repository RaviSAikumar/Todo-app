const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../controllers/auth-controller");
const { upload, imageUploadUtil } = require("../helpers/cloudinary");
const User = require("../models/user");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

router.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Remove sensitive data
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Upload Profile Picture
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("profile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });

      const result = await imageUploadUtil(req.file.buffer, req.file.mimetype);

      await User.findByIdAndUpdate(req.user.id, {
        profilePic: result.secure_url,
      });

      res.json({ success: true, profilePic: result.secure_url });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Upload failed", error: err.message });
    }
  }
);

module.exports = router;
