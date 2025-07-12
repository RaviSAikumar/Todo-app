const express = require("express");
const {
  addTask,
  getAllTasks,
  deleteTask,
  updateTask,
} = require("../controllers/todotask-controller");
const { authMiddleware } = require("../controllers/auth-controller");

const router = new express.Router();

router.post("/addtask", authMiddleware, addTask);
router.get("/alltasks", authMiddleware, getAllTasks);
router.put("/update/:id", authMiddleware, updateTask);
router.delete("/delete/:id", authMiddleware, deleteTask);

module.exports = router;
