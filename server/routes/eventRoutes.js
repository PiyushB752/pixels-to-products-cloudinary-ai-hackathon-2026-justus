const express = require("express");

const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} = require("../controllers/eventController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

router.post("/:id/register", registerForEvent);
router.delete("/:id/register", unregisterFromEvent);

module.exports = router;