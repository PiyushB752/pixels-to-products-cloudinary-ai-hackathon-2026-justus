const express = require("express");

const { chatWithAI } = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/chat", chatWithAI);

module.exports = router;