import React, { useState, useEffect } from "react";
import axios from "axios";

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

  return (
    <div>
      <h2>Todo List</h2>
      <div>
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodo}
          onChange={handleInputChange}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.title}
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
