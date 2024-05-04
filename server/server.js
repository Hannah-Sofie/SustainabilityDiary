require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./dbconnect");
const app = express();
const PORT = process.env.PORT || 8002;

// CORS configuration for different environments
const whitelist = ["http://localhost:3000", "http://localhost:8083"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This is important for cookies, authorization headers with HTTPS
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// Connect to MongoDB
connectDB();

// Static file serving for uploaded images with custom CORS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
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

app.use("/api/users", userRoutes);
app.use("/reflections", reflectionEntryRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/facts", factRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export the app for testing
module.exports = app;

// Function to start the server, exported for testing purposes
module.exports.start = function () {
  const PORT = process.env.PORT || 8002;
  return app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
