// routes/index.js
const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");

router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

module.exports = router;
