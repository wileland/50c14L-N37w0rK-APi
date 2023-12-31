// controllers/userController.js
const User = require("../models/User");

// Helper function to validate user existence
async function validateUserExists(userId) {
  try {
    const user = await User.findById(userId);
    return user != null;
  } catch (error) {
    // Log error and return false if there's a problem with the database operation
    console.error(`Error validating user existence: ${error.message}`);
    return false;
  }
}

// Add a new user
exports.createUser = async (req, res) => {
  if (!req.body.username || !req.body.email) {
    return res.status(400).json({ message: "Username and email are required" });
  }

  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get a single user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// Update a user by id
exports.updateUser = async (req, res) => {
  const userExists = await validateUserExists(req.params.id);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete a user by id
exports.deleteUser = async (req, res) => {
  const userExists = await validateUserExists(req.params.id);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Add a friend to a user's friend list
exports.addFriend = async (req, res) => {
  const userExists = await validateUserExists(req.params.userId);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding friend", error: error.message });
  }
};

// Remove a friend from a user's friend list
exports.removeFriend = async (req, res) => {
  const userExists = await validateUserExists(req.params.userId);
  if (!userExists) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error removing friend", error: error.message });
  }
};
