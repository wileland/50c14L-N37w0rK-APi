// controllers/userController.js
const User = require("../models/User");

// Add a new user
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

// Other CRUD operations here...

// Next steps: Implement all user-related functionalities (CRUD).
