import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos once on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Function to fetch todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/todos`
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // Update new todo input
  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  // Function to add a new todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return; // Prevent adding empty todos
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/todos/create`,
        {
          title: newTodo.trim(),
          description: "",
          completed: false, // Add completed property
        }
      );
      setTodos(todos.concat(response.data)); // Add new todo to the list
      setNewTodo(""); // Clear input field
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  // Function to delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id)); // Remove todo from the list
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Function to toggle the completion status of a todo
  const toggleTodoCompletion = async (id) => {
    try {
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      await axios.put(`${process.env.REACT_APP_API_URL}/api/todos/${id}`, {
        completed: !todos.find((todo) => todo._id === id).completed,
      });
    } catch (error) {
      console.error("Failed to update todo completion:", error);
    }
  };

  return (
    <div className="todo-container">
      <h1>
        Todo List
        <span>Get things done, one item at a time.</span>
      </h1>
      <div className="todo-form">
        <input
          className="todo-input"
          type="text"
          placeholder="Enter a new todo"
          value={newTodo}
          onChange={handleInputChange}
        />
        <button className="todo-button" onClick={handleAddTodo}>
          Add item
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.completed ? "done" : ""}`}
          >
            <span className="label">{todo.title}</span>
            <div className="actions">
              <button
                className="btn-picto"
                type="button"
                onClick={() => toggleTodoCompletion(todo._id)}
                aria-label={
                  todo.completed ? "Mark Incomplete" : "Mark Complete"
                }
                title={todo.completed ? "Mark Incomplete" : "Mark Complete"}
              >
                <i className="material-icons">
                  {todo.completed ? "check_box" : "check_box_outline_blank"}
                </i>
              </button>
              <button
                className="btn-picto"
                type="button"
                onClick={() => handleDeleteTodo(todo._id)}
                aria-label="Delete"
                title="Delete"
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
