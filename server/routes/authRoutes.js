const express = require("express");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  removeProfilePicture
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);

router.post(
  "/profile/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadProfilePicture
);

router.delete(
  "/profile/avatar",
  authMiddleware,
  removeProfilePicture
);

module.exports = router;