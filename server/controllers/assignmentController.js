const mongoose = require("mongoose");
const Assignment = require("../models/Assignment");

// GET /api/assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      user: req.user._id,
    }).sort({ dueDate: 1, createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);

    res.status(500).json({
      message: "Failed to fetch assignments",
    });
  }
};

// GET /api/assignments/:id
const getAssignmentById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
      });
    }

    const assignment = await Assignment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json(assignment);
  } catch (error) {
    console.error("Get assignment error:", error);

    res.status(500).json({
      message: "Failed to fetch assignment",
    });
  }
};

// POST /api/assignments
const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description = "",
      subject = "",
      dueDate,
      status = "Pending",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Assignment title is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        message: "Due date is required",
      });
    }

    if (Number.isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({
        message: "Invalid due date",
      });
    }

    const assignment = await Assignment.create({
      user: req.user._id,
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      dueDate,
      status,
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    res.status(500).json({
      message: "Failed to create assignment",
    });
  }
};

// PUT /api/assignments/:id
const updateAssignment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
      });
    }

    const assignment = await Assignment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    const {
      title,
      description,
      subject,
      dueDate,
      status,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Assignment title cannot be empty",
        });
      }

      assignment.title = title.trim();
    }

    if (description !== undefined) {
      assignment.description = description.trim();
    }

    if (subject !== undefined) {
      assignment.subject = subject.trim();
    }

    if (dueDate !== undefined) {
      if (Number.isNaN(new Date(dueDate).getTime())) {
        return res.status(400).json({
          message: "Invalid due date",
        });
      }

      assignment.dueDate = dueDate;
    }

    if (status !== undefined) {
      assignment.status = status;
    }

    await assignment.save();

    res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)[0].message,
      });
    }

    res.status(500).json({
      message: "Failed to update assignment",
    });
  }
};

// DELETE /api/assignments/:id
const deleteAssignment = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid assignment ID",
      });
    }

    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);

    res.status(500).json({
      message: "Failed to delete assignment",
    });
  }
};

module.exports = {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};