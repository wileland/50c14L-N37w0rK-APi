// server.js
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes"); // Assumes you have an index.js in your routes directory that handles this.

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/socialNetworkDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Next steps: Implement route handlers in controllers and define models.
  });
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
  // Handle error appropriately
});
