const TodoTask = require("../models/todotask");
const User = require("../models/user");

const addTask = async (req, res) => {
  try {
    const { title, description, date, time } = req.body;
    const userId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title required",
      });
    } else if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId required",
      });
    }

    const newTask = await TodoTask.create({
      title,
      description,
      date,
      time,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  const userId = req.user.id; // Get user ID from the authenticated request

  try {
    // Find all tasks belonging to the user
    const tasks = await TodoTask.find({ user: userId }).sort({ createdAt: -1 }); // Sort by creation date

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, date, time } = req.body;
  const userId = req.user.id;

  if (
    !title &&
    description === undefined &&
    completed === undefined &&
    date === undefined &&
    time === undefined
  ) {
    return res
      .status(400)
      .json({ success: false, message: "No fields provided for update" });
  }

  try {
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) {
      updateFields.completed = completed;
      // ✅ Set completedAt if task is marked as completed
      updateFields.completedAt = completed ? new Date() : null;
    }
    if (date !== undefined) updateFields.date = date;
    if (time !== undefined) updateFields.time = time;

    const updatedTask = await TodoTask.findOneAndUpdate(
      { _id: id, user: userId },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized to update",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (err) {
    console.error("Error updating task:", err);
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedTask = await TodoTask.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or unauthorized to delete",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task: deletedTask,
    });
  } catch (err) {
    console.error("Error deleting task:", err);
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID format" });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addTask, getAllTasks, deleteTask, updateTask };
