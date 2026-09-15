const Attendance = require("../models/Attendance");

// GET /api/attendance
const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      user: req.user._id,
    }).sort({ subject: 1 });

    const subjects = attendance.map((item) => {
      const totalClasses =
        item.classesAttended + item.classesMissed;

      const percentage =
        totalClasses > 0
          ? Number(
              ((item.classesAttended / totalClasses) * 100).toFixed(2)
            )
          : 0;

      return {
        _id: item._id,
        subject: item.subject,
        classesAttended: item.classesAttended,
        classesMissed: item.classesMissed,
        totalClasses,
        percentage,
      };
    });

    const totalAttended = subjects.reduce(
      (sum, item) => sum + item.classesAttended,
      0
    );

    const totalMissed = subjects.reduce(
      (sum, item) => sum + item.classesMissed,
      0
    );

    const totalClasses = totalAttended + totalMissed;

    const overallPercentage =
      totalClasses > 0
        ? Number(((totalAttended / totalClasses) * 100).toFixed(2))
        : 0;

    res.status(200).json({
      overall: {
        percentage: overallPercentage,
        classesAttended: totalAttended,
        classesMissed: totalMissed,
        totalClasses,
      },
      subjects,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
};

// POST /api/attendance
const createAttendance = async (req, res) => {
  try {
    const {
      subject,
      classesAttended = 0,
      classesMissed = 0,
    } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    if (classesAttended < 0 || classesMissed < 0) {
      return res.status(400).json({
        message: "Attendance values cannot be negative",
      });
    }

    const existingAttendance = await Attendance.findOne({
      user: req.user._id,
      subject: subject.trim(),
    });

    if (existingAttendance) {
      return res.status(409).json({
        message: "Attendance for this subject already exists",
      });
    }

    const attendance = await Attendance.create({
      user: req.user._id,
      subject: subject.trim(),
      classesAttended,
      classesMissed,
    });

    res.status(201).json({
      message: "Attendance added successfully",
      attendance,
    });
  } catch (error) {
    console.error("Create attendance error:", error);

    res.status(500).json({
      message: "Failed to add attendance",
    });
  }
};

// PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject,
      classesAttended,
      classesMissed,
    } = req.body;

    const attendance = await Attendance.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    if (
      classesAttended !== undefined &&
      classesAttended < 0
    ) {
      return res.status(400).json({
        message: "Classes attended cannot be negative",
      });
    }

    if (
      classesMissed !== undefined &&
      classesMissed < 0
    ) {
      return res.status(400).json({
        message: "Classes missed cannot be negative",
      });
    }

    if (subject !== undefined) {
      const trimmedSubject = subject.trim();

      if (!trimmedSubject) {
        return res.status(400).json({
          message: "Subject cannot be empty",
        });
      }

      const duplicate = await Attendance.findOne({
        user: req.user._id,
        subject: trimmedSubject,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          message: "Attendance for this subject already exists",
        });
      }

      attendance.subject = trimmedSubject;
    }

    if (classesAttended !== undefined) {
      attendance.classesAttended = classesAttended;
    }

    if (classesMissed !== undefined) {
      attendance.classesMissed = classesMissed;
    }

    await attendance.save();

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);

    res.status(500).json({
      message: "Failed to update attendance",
    });
  }
};

// DELETE /api/attendance/:id
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error("Delete attendance error:", error);

    res.status(500).json({
      message: "Failed to delete attendance",
    });
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};