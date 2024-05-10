const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/verifyToken");
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.get("/", verifyToken, getAllTodos);
router.get("/:id", verifyToken, getTodoById);
router.post("/create", verifyToken, createTodo);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

module.exports = router;
