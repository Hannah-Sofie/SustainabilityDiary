import React from "react";
import { render, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { toast } from "react-toastify";
import StudentList from "../../components/StudentList/StudentList";

// Mocking toast functions to avoid side effects in logs
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("StudentList Integration Tests", () => {
  let mockAxios;

  beforeEach(() => {
    // Setup axios mock before each test
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockAxios = new MockAdapter(axios);
    jest.clearAllMocks(); // Clear mock call history between tests
  });

  afterEach(() => {
    // Reset mocks after each test
    console.error.mockRestore();
    mockAxios.reset();
  });

  it("renders fetched student data successfully", async () => {
    const mockData = [
      { _id: "1", name: "Alice", email: "alice@ntnu.no" },
      { _id: "2", name: "Bob", email: "bob@ntnu.no" },
    ];
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, mockData);

    render(<StudentList />);
    for (let student of mockData) {
      await screen.findByText(student.name);
      await screen.findByText(student.email);
    }
  });

  it("handles no data case gracefully", async () => {
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, []);

    render(<StudentList />);
    await screen.findByText("No students found.");
  });

  it("displays an error when the API call fails", async () => {
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .networkError();

    render(<StudentList />);
    await screen.findByText("No students found.");
    expect(toast.error).toHaveBeenCalledWith(
      "Failed to fetch students. Please try again later."
    );
  });

  it("displays an error for malformed data responses", async () => {
    const mockData = [{}, {}]; // Incorrect data format but still an array
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, mockData);

    render(<StudentList />);
    await screen.findByText("No students found.");
  });
});
