const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");
const User = require("../models/User");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne();

    if (!user) {
      console.log("Create a Campusly user first.");
      process.exit(0);
    }

    await Attendance.deleteMany({ user: user._id });
    await Assignment.deleteMany({ user: user._id });
    await Task.deleteMany({ user: user._id });

    await Attendance.insertMany([
      {
        user: user._id,
        subject: "Data Structures",
        classesAttended: 22,
        classesMissed: 3,
      },
      {
        user: user._id,
        subject: "Database Systems",
        classesAttended: 18,
        classesMissed: 2,
      },
      {
        user: user._id,
        subject: "Web Development",
        classesAttended: 24,
        classesMissed: 1,
      },
      {
        user: user._id,
        subject: "Computer Networks",
        classesAttended: 17,
        classesMissed: 5,
      },
    ]);

    await Assignment.insertMany([
      {
        user: user._id,
        title: "Database Design Report",
        subject: "Database Systems",
        description: "Complete the database normalization report.",
        dueDate: new Date(Date.now() + 2 * 86400000),
        status: "Pending",
      },
      {
        user: user._id,
        title: "React Dashboard",
        subject: "Web Development",
        description: "Build the responsive dashboard interface.",
        dueDate: new Date(Date.now() + 5 * 86400000),
        status: "In Progress",
      },
      {
        user: user._id,
        title: "Network Analysis",
        subject: "Computer Networks",
        description: "Submit the network analysis assignment.",
        dueDate: new Date(Date.now() + 8 * 86400000),
        status: "Pending",
      },
    ]);

    await Task.insertMany([
      {
        user: user._id,
        title: "Review lecture notes",
        priority: "High",
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        user: user._id,
        title: "Prepare presentation",
        priority: "Medium",
        dueDate: new Date(Date.now() + 3 * 86400000),
      },
      {
        user: user._id,
        title: "Update portfolio",
        priority: "Low",
        dueDate: new Date(Date.now() + 7 * 86400000),
      },
    ]);

    await Event.deleteMany({});
    await Announcement.deleteMany({});

    await Event.insertMany([
      {
        title: "Campus Hackathon 2026",
        description: "Build innovative solutions with fellow students.",
        type: "Hackathon",
        date: new Date(Date.now() + 4 * 86400000),
        location: "Innovation Lab",
      },
      {
        title: "AI & Future Technologies",
        description: "Industry talk on modern AI development.",
        type: "Tech Talk",
        date: new Date(Date.now() + 10 * 86400000),
        location: "Main Auditorium",
      },
      {
        title: "Web Development Workshop",
        description: "Hands-on workshop covering modern web development.",
        type: "Workshop",
        date: new Date(Date.now() + 15 * 86400000),
        location: "Computer Lab 2",
      },
    ]);

    await Announcement.insertMany([
      {
        title: "Mid-Semester Examination Schedule",
        content: "The mid-semester examination schedule has been published.",
        category: "Exam",
      },
      {
        title: "Hackathon Registrations Open",
        content: "Registrations are now open for the annual campus hackathon.",
        category: "Event",
      },
      {
        title: "Assignment Submission Reminder",
        content: "Remember to submit your pending assignments before their deadlines.",
        category: "Assignment",
      },
    ]);

    console.log("Campusly sample data created successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();