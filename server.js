require("dotenv").config(); // This line is required to use the .env variables
const connectDB = require("./config/database");
const User = require("./models/User");

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes"); // Make sure you have an index.js file in your routes directory

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Connect to MongoDB
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/socialNetworkDB",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the Express server after the database connection is established
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
