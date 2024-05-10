const Todo = require("../models/todoSchema");
const CreateError = require("../utils/createError");

const getAllTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (error) {
    next(new CreateError("Failed to fetch todos", 500));
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(new CreateError("Todo not found", 404));
    }
    res.json(todo);
  } catch (error) {
    next(new CreateError("Failed to fetch todo", 500));
  }
};

const createTodo = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    const newTodo = await Todo.create({
      userId: req.user._id,
      title,
      description,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    next(new CreateError("Failed to create todo", 500));
  }
};

const updateTodo = async (req, res, next) => {
  const { title, description, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return next(new CreateError("Todo not found", 404));
    }
    res.json(updatedTodo);
  } catch (error) {
    next(new CreateError("Failed to update todo", 500));
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return next(new CreateError("Todo not found", 404));
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(new CreateError("Failed to delete todo", 500));
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
