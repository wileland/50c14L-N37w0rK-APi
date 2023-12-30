// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/users", userController.createUser);

// Next steps: Define other user routes for getting, updating, and deleting users.

module.exports = router;
