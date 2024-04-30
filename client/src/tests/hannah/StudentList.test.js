import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import StudentList from "../components/StudentList/StudentList";

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
    mockAxios = new MockAdapter(axios);
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Reset mocks after each test
    mockAxios.reset();
    console.error.mockRestore();
  });

  it("renders fetched student data successfully", async () => {
    const mockData = [
      { _id: "1", name: "Alice Johnson", email: "alice@ntnu.no" },
      { _id: "2", name: "Bob Smith", email: "bob@ntnu.no" },
    ];
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, mockData);

    render(<StudentList />);
    await waitFor(() => {
      mockData.forEach(async (student) => {
        expect(await screen.findByText(student.name)).toBeInTheDocument();
        expect(screen.getByText(student.email)).toBeInTheDocument();
      });
    });
  });

  it("handles no data case gracefully", async () => {
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, []);

    render(<StudentList />);
    expect(await screen.findByText("No students found.")).toBeInTheDocument();
  });

  it("displays an error for malformed data responses", async () => {
    const malformedData = [{}, {}]; // Incorrect data format
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, malformedData);

    render(<StudentList />);
    await screen.findByText("No students found.");
  });

  it("tests boundary case with a large number of students", async () => {
    const largeSetOfStudents = Array.from({ length: 100 }, (_, i) => ({
      _id: String(i),
      name: `Student ${i}`,
      email: `student${i}@ntnu.no`,
    }));
    mockAxios
      .onGet(`${process.env.REACT_APP_API_URL}/api/users/students`)
      .reply(200, largeSetOfStudents);

    render(<StudentList />);
    await waitFor(() => {
      largeSetOfStudents.forEach(async (student) => {
        expect(await screen.findByText(student.name)).toBeInTheDocument();
      });
    });
  });
});
