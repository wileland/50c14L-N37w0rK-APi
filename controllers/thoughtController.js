const Thought = require("../models/Thought");
const User = require("../models/User");

// Helper function to validate thought existence
const validateThoughtExists = async (thoughtId) => {
  try {
    const thought = await Thought.findById(thoughtId);
    return thought !== null;
  } catch (error) {
    throw new Error(`Error validating thought existence: ${error.message}`);
  }
};

// Helper function for sending error responses
const sendErrorResponse = (res, statusCode, message, error = null) => {
  res
    .status(statusCode)
    .json({ message, ...(error && { error: error.message }) });
};

// Get all thoughts
exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (error) {
    sendErrorResponse(res, 500, "Error fetching thoughts", error);
  }
};

// Get a single thought by id
exports.getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return sendErrorResponse(res, 404, "Thought not found");
    }
    res.json(thought);
  } catch (error) {
    sendErrorResponse(res, 500, "Error fetching thought", error);
  }
};

// Create a new thought
exports.createThought = async (req, res) => {
  const { thoughtText, username, userId } = req.body;
  if (!thoughtText || !username) {
    return sendErrorResponse(
      res,
      400,
      "Thought text and username are required"
    );
  }

  try {
    const thought = await Thought.create({ thoughtText, username, userId });
    await User.findByIdAndUpdate(userId, { $push: { thoughts: thought._id } });
    res.status(201).json(thought);
  } catch (error) {
    sendErrorResponse(res, 400, "Error creating thought", error);
  }
};

// Update a thought by id
exports.updateThought = async (req, res) => {
  try {
    if (!(await validateThoughtExists(req.params.id))) {
      return sendErrorResponse(res, 404, "Thought not found");
    }
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(thought);
  } catch (error) {
    sendErrorResponse(res, 400, "Error updating thought", error);
  }
};

// Delete a thought by id
exports.deleteThought = async (req, res) => {
  try {
    if (!(await validateThoughtExists(req.params.id))) {
      return sendErrorResponse(res, 404, "Thought not found");
    }
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (thought) {
      await User.findByIdAndUpdate(thought.userId, {
        $pull: { thoughts: thought._id },
      });
    }
    res.json({ message: "Thought successfully deleted" });
  } catch (error) {
    sendErrorResponse(res, 500, "Error deleting thought", error);
  }
};

// Add a reaction to a thought
exports.addReaction = async (req, res) => {
  try {
    if (!(await validateThoughtExists(req.params.thoughtId))) {
      return sendErrorResponse(res, 404, "Thought not found");
    }
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    res.json(thought);
  } catch (error) {
    sendErrorResponse(res, 400, "Error adding reaction", error);
  }
};

// Remove a reaction from a thought
exports.removeReaction = async (req, res) => {
  try {
    if (!(await validateThoughtExists(req.params.thoughtId))) {
      return sendErrorResponse(res, 404, "Thought or reaction not found");
    }
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    res.json(thought);
  } catch (error) {
    sendErrorResponse(res, 500, "Error removing reaction", error);
  }
};

module.exports = exports;
