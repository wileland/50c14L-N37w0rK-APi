// controllers/userController.js
const User = require("../models/User");

// Helper function to validate user existence
async function validateUserExists(userId) {
  try {
    const user = await User.findById(userId);
    return user !== null;
  } catch (error) {
    throw new Error(`Error validating user existence: ${error.message}`);
  }
}

// Helper function for sending error responses
const sendErrorResponse = (res, statusCode, message, error = null) => {
  res
    .status(statusCode)
    .json({ message, ...(error && { error: error.message }) });
};

// Add a new user
exports.createUser = async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    return sendErrorResponse(res, 400, "Username and email are required");
  }

  try {
    const newUser = await User.create({ username, email });
    res.status(201).json(newUser);
  } catch (error) {
    sendErrorResponse(res, 400, "Error creating user", error);
  }
};

// Get all users with pagination
exports.getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({}).skip(skip).limit(limit);
    res.json(users);
  } catch (error) {
    sendErrorResponse(res, 500, "Error fetching users", error);
  }
};

// Get a single user by id with friend and thought data populated
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("friends")
      .populate("thoughts");
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }
    res.json(user);
  } catch (error) {
    sendErrorResponse(res, 500, "Error fetching user", error);
  }
};

// Update a user by id
exports.updateUser = async (req, res) => {
  try {
    if (!(await validateUserExists(req.params.id))) {
      return sendErrorResponse(res, 404, "User not found");
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    sendErrorResponse(res, 400, "Error updating user", error);
  }
};

// Delete a user by id
exports.deleteUser = async (req, res) => {
  try {
    if (!(await validateUserExists(req.params.id))) {
      return sendErrorResponse(res, 404, "User not found");
    }
    await User.findByIdAndDelete(req.params.id);
    // TODO: Remove this user from other users' friend lists and delete associated thoughts
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    sendErrorResponse(res, 500, "Error deleting user", error);
  }
};

// Add a friend to a user's friend list
exports.addFriend = async (req, res) => {
  try {
    if (
      !(await validateUserExists(req.params.userId)) ||
      !(await validateUserExists(req.params.friendId))
    ) {
      return sendErrorResponse(res, 404, "User not found");
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    sendErrorResponse(res, 400, "Error adding friend", error);
  }
};

// Remove a friend from a user's friend list
exports.removeFriend = async (req, res) => {
  try {
    if (!(await validateUserExists(req.params.userId))) {
      return sendErrorResponse(res, 404, "User not found");
    }
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    sendErrorResponse(res, 400, "Error removing friend", error);
  }
};
