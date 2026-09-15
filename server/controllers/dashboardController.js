const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();

    const [
      attendance,
      pendingAssignments,
      pendingTasks,
      upcomingEvents,
      recentAnnouncements,
    ] = await Promise.all([
      Attendance.find({ user: userId })
        .sort({ subject: 1 })
        .lean(),

      Assignment.find({
        user: userId,
        status: { $ne: "Completed" },
        dueDate: { $gte: now },
      })
        .sort({ dueDate: 1 })
        .limit(5)
        .lean(),

      Task.find({
        user: userId,
        completed: false,
      })
        .sort({ dueDate: 1, createdAt: -1 })
        .limit(5)
        .lean(),

      Event.find({
        date: { $gte: now },
      })
        .sort({ date: 1 })
        .limit(5)
        .lean(),

      Announcement.find()
        .sort({ publishedAt: -1 })
        .limit(5)
        .lean(),
    ]);

    let totalAttended = 0;
    let totalMissed = 0;

    const attendanceBySubject = attendance.map((item) => {
      totalAttended += item.classesAttended;
      totalMissed += item.classesMissed;

      const totalClasses =
        item.classesAttended + item.classesMissed;

      const percentage =
        totalClasses > 0
          ? Math.round(
              (item.classesAttended / totalClasses) * 100,
            )
          : 0;

      return {
        id: item._id,
        subject: item.subject,
        classesAttended: item.classesAttended,
        classesMissed: item.classesMissed,
        percentage,
      };
    });

    const totalClasses = totalAttended + totalMissed;

    const overallAttendance =
      totalClasses > 0
        ? Math.round((totalAttended / totalClasses) * 100)
        : 0;

    const totalPendingAssignments = await Assignment.countDocuments({
      user: userId,
      status: { $ne: "Completed" },
    });

    const totalPendingTasks = await Task.countDocuments({
      user: userId,
      completed: false,
    });

    return res.status(200).json({
      success: true,

      data: {
        statistics: {
          overallAttendance,
          totalPendingAssignments,
          totalPendingTasks,
          upcomingEvents: upcomingEvents.length,
        },

        attendance: {
          overall: overallAttendance,
          totalAttended,
          totalMissed,
          subjects: attendanceBySubject,
        },

        assignments: pendingAssignments,

        tasks: pendingTasks,

        events: upcomingEvents,

        announcements: recentAnnouncements,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard data",
    });
  }
};

module.exports = {
  getDashboard,
};