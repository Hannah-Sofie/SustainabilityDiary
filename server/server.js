require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./dbconnect");
const app = express();
const PORT = process.env.PORT || 8002;

// Check for required environment variables
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

// CORS configuration for different environments
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8083",
  "http://team3.sustainability.it.ntnu.no",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// Connect to MongoDB
connectDB().then(() => {
  // Start the server only after the database connection is established
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Static file serving for uploaded images with custom CORS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "./uploads"), {
    setHeaders: function (res, path) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Routes
const userRoutes = require("./routes/userRoutes");
const reflectionEntryRoutes = require("./routes/reflectionEntryRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const factRoutes = require("./routes/factRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const todoRoutes = require("./routes/todoRoutes");
const achievementRoutes = require("./routes/achievementRoutes");

app.use("/api/users", userRoutes);
app.use("/api/reflections", reflectionEntryRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/facts", factRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/achievements", achievementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message: err.message || "Internal Server Error",
  });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Export the app for testing
module.exports = app;

// Function to start the server, exported for testing purposes
module.exports.start = function () {
  const PORT = process.env.PORT || 8002;
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
