import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ClassroomDetail from "../../components/ClassroomDetail/ClassroomDetail";

// Mock the useParams and useNavigate hooks from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "123",
  }),
  useNavigate: () => jest.fn(),
}));

// Initial mock setup for axios and auth context
const mockAxios = new MockAdapter(axios);
const authContextValue = {
  userData: {
    token: "fake-token",
    role: "teacher",
  },
};

describe("ClassroomDetail Component Tests", () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it("should display loading indicator while fetching data", () => {
    mockAxios.onGet(`/api/classrooms/123`).networkError();
    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <ClassroomDetail />
        </Router>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should handle and display fetched classroom data", async () => {
    const classroomData = {
      title: "Introduction to Biology",
      description: "A basic introduction to biological sciences",
      learningGoals: "Understand basic biological concepts",
      classCode: "BIO101",
      photoUrl: "",
      students: [],
    };
    mockAxios.onGet(`/api/classrooms/123`).reply(200, classroomData);
    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <ClassroomDetail />
        </Router>
      </AuthContext.Provider>
    );

    expect(await screen.findByText(classroomData.title)).toBeInTheDocument();
    expect(screen.getByText(classroomData.description)).toBeInTheDocument();
    expect(screen.getByText(classroomData.learningGoals)).toBeInTheDocument();
  });

  it("should display default image when no photoUrl is provided", async () => {
    const classroomData = {
      title: "Chemistry Basics",
      description: "Introduction to Chemical Reactions",
      learningGoals: "Learn to balance chemical equations",
      classCode: "CHEM100",
      photoUrl: "",
      students: [],
    };
    mockAxios.onGet(`/api/classrooms/123`).reply(200, classroomData);
    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <ClassroomDetail />
        </Router>
      </AuthContext.Provider>
    );

    expect(await screen.findByText(classroomData.title)).toBeInTheDocument();
    const backgroundImage =
      document.querySelector(".classroom-header").style.backgroundImage;
    expect(backgroundImage).toContain("default-header.jpeg");
  });

  it("should handle errors when fetching classroom data", async () => {
    mockAxios.onGet(`/api/classrooms/123`).reply(500);
    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <ClassroomDetail />
        </Router>
      </AuthContext.Provider>
    );

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText("Introduction to Biology")).toBeNull();
  });

  it("should open and close the modal to view students", async () => {
    const classroomData = {
      title: "Physics for Beginners",
      description: "Learn the basics of physics",
      learningGoals: "Understand fundamental physics concepts",
      classCode: "PHY101",
      photoUrl: "",
      students: [
        {
          _id: "s1",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "student",
        },
      ],
    };
    mockAxios.onGet(`/api/classrooms/123`).reply(200, classroomData);
    render(
      <AuthContext.Provider value={authContextValue}>
        <Router>
          <ClassroomDetail />
        </Router>
      </AuthContext.Provider>
    );

    const viewStudentsButton = await screen.findByText("View Students");
    fireEvent.click(viewStudentsButton);
    expect(
      await screen.findByText("Students in Physics for Beginners")
    ).toBeInTheDocument();

    const closeModalButton = screen.getByText("Close");
    fireEvent.click(closeModalButton);
    expect(screen.queryByText("Students in Physics for Beginners")).toBeNull();
  });
});
