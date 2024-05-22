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

const PORT = 8093; //process.env.PORT || 809;

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

const whitelist = [
  "http://localhost:3000",
  "http://localhost:8083",
  "http://localhost:8093",
  "https://team3.sustainability.it.ntnu.no",
  "https://team3-api.sustainability.it.ntnu.no",
];

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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "./uploads"), {
    setHeaders: function (res, path) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.get("/", (req, res) => {
  const htmlContent = `
    <h1>API for Sustainability App</h1>
    <p>Welcome to the Team 3 backend service</p>
    <p>API is available at /api</p>
    <p>CORS is enabled for the following origins: ${whitelist.join(", ")}</p>
  `;
  res.send(htmlContent);
});

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

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message: err.message || "Internal Server Error",
  });
});

const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

module.exports = app;

module.exports.start = function () {
  const PORT = process.env.PORT || 8003;
  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
