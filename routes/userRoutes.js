// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers /* other controller methods */,
} = require("../controllers/userController");

// User routes
router.post("/", createUser);
router.get("/", getAllUsers);
// Other user routes...

module.exports = router;
