const mongoose = require("mongoose");
const Event = require("../models/Event");

// GET /api/events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() },
    })
      .populate("registeredUsers", "name email")
      .sort({ date: 1 });

    const userId = req.user._id.toString();

    const formattedEvents = events.map((event) => ({
      ...event.toObject(),
      registered: event.registeredUsers.some(
        (user) => user._id.toString() === userId
      ),
      registrationCount: event.registeredUsers.length,
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
};

// GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(req.params.id).populate(
      "registeredUsers",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const registered = event.registeredUsers.some(
      (user) =>
        user._id.toString() === req.user._id.toString()
    );

    res.status(200).json({
      ...event.toObject(),
      registered,
      registrationCount: event.registeredUsers.length,
    });
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      message: "Failed to fetch event",
    });
  }
};

// POST /api/events
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description = "",
      type = "Other",
      date,
      location = "",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Event title is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        message: "Event date is required",
      });
    }

    if (Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        message: "Invalid event date",
      });
    }

    const eventDate = new Date(date);

    if (eventDate < new Date()) {
      return res.status(400).json({
        message: "Event date must be in the future",
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      type,
      date: eventDate,
      location: location.trim(),
      registeredUsers: [],
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    res.status(500).json({
      message: "Failed to create event",
    });
  }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const {
      title,
      description,
      type,
      date,
      location,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Event title cannot be empty",
        });
      }

      event.title = title.trim();
    }

    if (description !== undefined) {
      event.description = description.trim();
    }

    if (type !== undefined) {
      event.type = type;
    }

    if (date !== undefined) {
      if (Number.isNaN(new Date(date).getTime())) {
        return res.status(400).json({
          message: "Invalid event date",
        });
      }

      event.date = new Date(date);
    }

    if (location !== undefined) {
      event.location = location.trim();
    }

    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    res.status(500).json({
      message: "Failed to update event",
    });
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findByIdAndDelete(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: "Failed to delete event",
    });
  }
};

// POST /api/events/:id/register
const registerForEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.date < new Date()) {
      return res.status(400).json({
        message: "Cannot register for a past event",
      });
    }

    const alreadyRegistered =
      event.registeredUsers.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyRegistered) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    event.registeredUsers.push(req.user._id);

    await event.save();

    res.status(200).json({
      message: "Registered for event successfully",
    });
  } catch (error) {
    console.error("Register event error:", error);

    res.status(500).json({
      message: "Failed to register for event",
    });
  }
};

// DELETE /api/events/:id/register
const unregisterFromEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const originalLength =
      event.registeredUsers.length;

    event.registeredUsers =
      event.registeredUsers.filter(
        (userId) =>
          userId.toString() !==
          req.user._id.toString()
      );

    if (
      event.registeredUsers.length === originalLength
    ) {
      return res.status(400).json({
        message: "You are not registered for this event",
      });
    }

    await event.save();

    res.status(200).json({
      message: "Unregistered from event successfully",
    });
  } catch (error) {
    console.error("Unregister event error:", error);

    res.status(500).json({
      message: "Failed to unregister from event",
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
};