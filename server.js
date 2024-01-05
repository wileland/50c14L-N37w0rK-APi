require("dotenv").config();
const connectDB = require("./config/database");
const routes = require("./routes"); // Assumes an index.js in your routes directory

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
