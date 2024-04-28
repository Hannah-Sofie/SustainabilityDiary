// Login.integration.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../pages/Login";

test("displays validation message when the email field is left empty", () => {
  render(<Login />);

  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  fireEvent.change(emailInput, { target: { value: "" } });
  fireEvent.click(submitButton);

  const validationMessage = screen.getByText(/email is required/i); // Assuming your form displays this message
  expect(validationMessage).toBeInTheDocument();
});
