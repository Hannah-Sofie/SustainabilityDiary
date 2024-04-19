require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const connectDB = require("./dbconnect");
const PORT = process.env.PORT || 8002;

// Import routes
const userRoutes = require("./routes/userRoutes");
const reflectionEntryRoutes = require("./routes/reflectionEntryRoutes"); // Import reflection entry routes
const classroomRoutes = require("./routes/classroomRoutes"); // Import classroom routes

// Adjust CORS Middleware for Specific Origin and Credentials
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8083"], // Allow your frontend origin
  credentials: true, // Allow sending cookies and headers with requests
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Static file serving for uploaded images
app.use("/uploads", express.static("uploads"));

// Use routes
app.use("/", userRoutes); // Use user routes
app.use("/reflections", reflectionEntryRoutes); // Use reflection entry routes
app.use("/api/classrooms", classroomRoutes); // Use classroom routes

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Listen for SIGINT signal (e.g., from pressing Ctrl+C) to gracefully shutdown the server
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close(); // Close MongoDB connection
  console.log("MongoDB connection closed.");
  process.exit(0); // Exit the process
});

module.exports = app;
