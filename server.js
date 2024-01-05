require("dotenv").config();
const connectDB = require("./config/database");
const routes = require("./routes"); // Assumes an index.js in your routes directory

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up a prefix for all routes defined in the routes directory
app.use("/api", routes);

// Connect to MongoDB
connectDB()
  .then(() => {
    // Only start the server if the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
