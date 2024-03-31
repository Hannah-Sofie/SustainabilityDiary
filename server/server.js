require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const app = express();
const connectDB = require("./dbconnect");
const PORT = process.env.PORT || 8002;

// Adjust CORS Middleware for Specific Origin and Credentials
const corsOptions = {
  origin: "http://localhost:3000", // Allow your frontend origin
  credentials: true, // Allow sending cookies and headers with requests
};

app.use(cors(corsOptions)); // Use CORS options here
app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware here

// Routes
app.use("/", require("./routes/userRoutes"));

// Connect to MongoDB
connectDB();

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
