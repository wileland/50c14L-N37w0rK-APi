const express = require("express");
const router = express.Router();

// Import other route modules
const userRoutes = require("./userRoutes");
const thoughtRoutes = require("./thoughtRoutes");
// Import other route files as needed

// Use the imported route modules
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);
// Use other route files as needed

// Export the router
module.exports = router;
