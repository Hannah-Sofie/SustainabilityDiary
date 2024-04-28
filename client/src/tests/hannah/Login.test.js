import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login"; // Adjust the import path as necessary
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Adjust the import path as necessary

// Mock the useAuth hook
const mockLogin = jest.fn();

// Wrapper component to provide necessary context
const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthContext.Provider value={{ isAuthenticated: false, login: mockLogin }}>
      {children}
    </AuthContext.Provider>
  </BrowserRouter>
);

test("submits credentials on form submission", async () => {
  render(<Login />, { wrapper: Wrapper });

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password" },
  });

  // Click on the submit button
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  // Check if the login function was called with the correct arguments
  expect(mockLogin).toHaveBeenCalledWith({
    email: "test@example.com",
    password: "password",
  });
});
