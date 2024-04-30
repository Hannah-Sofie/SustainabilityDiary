import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Login from "../../components/LoginForm/LoginForm";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import axios from "axios";

// Mock the useNavigate function from react-router-dom to control and test navigation behavior.
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// Mock axios to control the behavior of HTTP requests and ensure they do not actually call network resources.
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: { isAuthenticated: false } })),
  post: jest.fn(),
}));

// Mock the useAuth hook from AuthContext to simulate authentication behavior in tests.
jest.mock("../../context/AuthContext", () => ({
  ...jest.requireActual("../../context/AuthContext"),
  useAuth: jest.fn(),
}));

// This mock function simulates the login function that will be called within the component.
const mockLogin = jest.fn();

describe("<Login />", () => {
  // Before each test, render the Login component within the context it expects (AuthProvider and BrowserRouter).
  beforeEach(async () => {
    useAuth.mockImplementation(() => ({
      isAuthenticated: false,
      login: mockLogin,
    }));

    await act(async () => {
      render(
        <AuthProvider>
          <BrowserRouter>
            <Login />
          </BrowserRouter>
        </AuthProvider>,
      );
    });
  });

  // Test to ensure the login form is properly rendered with the necessary fields.
  test("renders login form", async () => {
    await act(async () => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  // Test to ensure that user input is handled correctly and state updates as expected.
  test("allows the user to enter their credentials", async () => {
    const testEmail = "testuser@example.com";
    const testPassword = "password123";
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: testEmail },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: testPassword },
      });
    });

    expect(screen.getByLabelText(/email/i).value).toBe(testEmail);
    expect(screen.getByLabelText(/password/i).value).toBe(testPassword);
  });

  // Test to verify if the navigation to the dashboard occurs after successful login.
  test("navigates to dashboard on successful login", async () => {
    // Simulate successful login by resolving mockLogin with an object indicating the user is authenticated.
    mockLogin.mockResolvedValueOnce({ isAuthenticated: true });

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "testuser@example.com" },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
      });
      fireEvent.submit(screen.getByRole("button", { name: /login/i }));
    });

    await waitFor(() =>
      expect(mockLogin).toHaveBeenCalledWith({
        email: "testuser@example.com",
        password: "password123",
      }),
    );

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard"),
    );
  });
});
