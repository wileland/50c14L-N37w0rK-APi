const Thought = require("../models/Thought");
const User = require("../models/User");

// Helper function to validate thought existence
const validateThoughtExists = async (thoughtId) => {
  const thought = await Thought.findById(thoughtId);
  return thought !== null;
};

// Helper function for sending error responses
const sendErrorResponse = (res, status, message, error) => {
  res.status(status).json({ message, error: error.message });
};

// Get all thoughts
exports.getAllThoughts = async (req, res) => {
  try {
    // Use the `Thought` model to find all thoughts in the database
    const thoughts = await Thought.find({});

    // Send a JSON response with the retrieved thoughts
    res.json(thoughts);
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    sendErrorResponse(res, 500, "Error fetching thoughts", error);
  }
};

// Get a single thought by id
exports.getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching thought", error: error.message });
  }
};

// Create a new thought
exports.createThought = async (req, res) => {
  if (!req.body.thoughtText || !req.body.username) {
    return res
      .status(400)
      .json({ message: "Thought text and username are required" });
  }

  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });
    res.status(201).json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating thought", error: error.message });
  }
};

// Update a thought by id
exports.updateThought = async (req, res) => {
  if (!(await validateThoughtExists(req.params.id))) {
    return res.status(404).json({ message: "Thought not found" });
  }

  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating thought", error: error.message });
  }
};

// Delete a thought by id
exports.deleteThought = async (req, res) => {
  if (!(await validateThoughtExists(req.params.id))) {
    return res.status(404).json({ message: "Thought not found" });
  }

  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(thought.userId, {
      $pull: { thoughts: thought._id },
    });
    res.json({ message: "Thought successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting thought", error: error.message });
  }
};

// Add a reaction to a thought
exports.addReaction = async (req, res) => {
  if (!(await validateThoughtExists(req.params.thoughtId))) {
    return res.status(404).json({ message: "Thought not found" });
  }

  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    res.json(thought);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error adding reaction", error: error.message });
  }
};

// Remove a reaction from a thought
exports.removeReaction = async (req, res) => {
  if (!(await validateThoughtExists(req.params.thoughtId))) {
    return res.status(404).json({ message: "Thought or reaction not found" });
  }

  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    res.json(thought);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing reaction", error: error.message });
  }
};

module.exports = exports;
  

