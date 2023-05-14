const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDb } = require("./config/db");
connectDb();
const app = express();

// Set up body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());
//Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
// Handle 404 errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Handle other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});
// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
