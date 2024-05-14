
# Sustainability Diary

Sustainability Diary is a web application designed to support the integration of sustainability into design education. It serves as an interactive platform where students and educators can document, reflect, and engage with sustainability practices within their coursework and beyond. The purpose is to deepen the understanding of sustainability impacts and solutions through active learning and reflection.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization
- Create, edit, and delete reflections
- Post reflections as public or private
- Post anonymous reflections
- Join and leave classrooms using class codes
- Create and manage classrooms
- Favorite/unfavorite classrooms
- Add and view sustainability resources
- Teacher and student dashboards
- FAQ and help section

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sustainability-diary.git
cd sustainability-diary
```

2. Install the dependencies:

```bash
npm install
```

3. Set up the backend server (assuming you have a backend server ready and configured).

4. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory of your project and add the following environment variables:

```env
REACT_APP_API_URL=http://localhost:5000
```

Adjust the `REACT_APP_API_URL` to match your backend server URL.

## Usage

### User Authentication

Users can register and log in to access the application's features. Authentication is handled using JSON Web Tokens (JWT).

### Reflections

- **Create Reflection**: Navigate to the "Reflections" section and click on "New Reflection". Fill out the title, body, and other required fields, then click "Submit".
- **Edit Reflection**: Navigate to the "Reflections" section, find the reflection you want to edit, and click the edit button (pencil icon). Make the necessary changes and save.
- **Delete Reflection**: Navigate to the "Reflections" section, find the reflection you want to delete, and click the delete button (trash icon). Confirm the deletion.

### Classrooms

- **Join Classroom**: Go to the "Classroom" section and click on "Join Classroom". Enter the class code provided by your teacher and click "Join".
- **Create Classroom**: Navigate to the "Classroom" section and click on "Create Classroom". Fill out the required details and click "Create".
- **Favorite Classroom**: Click the star icon next to the classroom title to favorite/unfavorite a classroom.
- **Leave Classroom**: Navigate to the classroom details page and click on the "Leave Classroom" button. Confirm the action.

### Sustainability Resources

- **Add Resource (Teacher Only)**: Navigate to the "Sustainability" section and click on "Add Resource". Fill out the title and link fields, then save the resource.

## API Endpoints

The backend API endpoints handle the data and authentication. Below are some example endpoints:

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `GET /api/reflections`: Get all reflections
- `POST /api/reflections`: Create a new reflection
- `PUT /api/reflections/:id`: Edit a reflection
- `DELETE /api/reflections/:id`: Delete a reflection
- `POST /api/classrooms/join`: Join a classroom
- `POST /api/classrooms/create`: Create a classroom
- `POST /api/resources`: Add a sustainability resource

## Components

### Main Components

- `DashboardStudent.jsx`: Student dashboard view
- `DashboardTeacher.jsx`: Teacher dashboard view
- `ReflectionEntries.jsx`: List of all reflections
- `EditReflectionEntry.jsx`: Edit a reflection entry
- `NewReflectionEntry.jsx`: Create a new reflection entry
- `ClassroomDetail.jsx`: Detailed view of a classroom
- `CreateClassroom.jsx`: Create a new classroom
- `JoinClassroom.jsx`: Join an existing classroom
- `Help.jsx`: Help and FAQ section

### Reusable Components

- `Sidebar.jsx`: Sidebar navigation
- `LoadingIndicator.jsx`: Loading indicator
- `Modal.jsx`: Modal component
- `FAQItem.jsx`: Individual FAQ item
- `FAQList.jsx`: List of FAQ items
