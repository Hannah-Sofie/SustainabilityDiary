const Todo = require("../models/todoSchema");
const CreateError = require("../utils/createError");

// Get all todos for the authenticated user
const getAllTodos = async (req, res, next) => {
  try {
    // Find todos by the user ID from the request
    const todos = await Todo.find({ userId: req.user._id });
    res.json(todos);
  } catch (error) {
    next(new CreateError("Failed to fetch todos", 500));
  }
};

// Get a single todo by its ID
const getTodoById = async (req, res, next) => {
  try {
    // Find the todo by ID from the request parameters
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return next(new CreateError("Todo not found", 404));
    }
    res.json(todo);
  } catch (error) {
    next(new CreateError("Failed to fetch todo", 500));
  }
};

// Create a new todo
const createTodo = async (req, res, next) => {
  const { title, description } = req.body;

  try {
    // Create a new todo with the user ID from the request
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

// Update an existing todo by its ID
const updateTodo = async (req, res, next) => {
  const { title, description, completed } = req.body;

  try {
    // Find and update the todo by ID from the request parameters
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

// Delete a todo by its ID
const deleteTodo = async (req, res, next) => {
  try {
    // Find and delete the todo by ID from the request parameters
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
