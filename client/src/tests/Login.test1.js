import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Login from "../pages/Login/Login";

// Setup mock
const mock = new MockAdapter(axios);

test("renders login form with email and password fields and a submit button", () => {
  render(<Login />);

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

// Example test to simulate form submission and mock Axios response
test("submits login form and handles response", async () => {
  // Mock any GET request to /users
  // arguments for reply are (status, data, headers)
  mock.onPost("/login").reply(200, {
    user: { id: 1, name: "John Doe" },
  });

  render(<Login />);

  // Simulate user input and form submission...
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  // Add your assertions here...
});
