import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../../components/LoginForm/LoginForm";

// Mock useAuth and useNavigate
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: jest.fn(),
  }),
}));

// Define the mocked login function
const mockLogin = jest.fn();
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    login: mockLogin,
  }),
}));

// Optionally reset mocks before each test if their state should not persist
beforeEach(() => {
  jest.clearAllMocks();
});

describe("Login Component - Comprehensive Test Suite", () => {
  it("renders the login form with email and password fields", () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should allow a typical user to log in with standard credentials", async () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john.doe@ntnu.no" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: "john.doe@ntnu.no",
        password: "password123",
      }),
    );
  });

  it("should handle extremely long email inputs", async () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    const longEmail = "a".repeat(300) + "@ntnu.no";
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: longEmail },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByLabelText(/email/i).value).toBe(longEmail);
  });

  it("should not allow login with undefined credentials", async () => {
    render(
      <Router>
        <Login />
      </Router>,
    );
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockLogin).not.toHaveBeenCalled());
    expect(screen.queryByText(/invalid credentials/i)).toBeNull(); // Adjust based on actual error handling
  });
});
