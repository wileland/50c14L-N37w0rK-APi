// controllers/thoughtController.js
const Thought = require("../models/Thought");
const User = require("../models/User"); // Assuming you have a User model for referencing the user's thoughts.

// Get all thoughts
exports.getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching thoughts", error });
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
    res.status(500).json({ message: "Error fetching thought", error });
  }
};

// Create a new thought
exports.createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    // Assuming that the User model has a 'thoughts' field that references thoughts
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });
    res.status(201).json(thought);
  } catch (error) {
    res.status(400).json({ message: "Error creating thought", error });
  }
};

// Update a thought by id
exports.updateThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: "Error updating thought", error });
  }
};

// Delete a thought by id
exports.deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    // Also remove the reference to the deleted thought from the user's thoughts array
    await User.findByIdAndUpdate(thought.userId, {
      $pull: { thoughts: thought._id },
    });
    res.json({ message: "Thought successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting thought", error });
  }
};

// Add a reaction to a thought
exports.addReaction = async (req, res) => {
  try {
    // Assuming reactions is a subdocument schema on Thought model
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(400).json({ message: "Error adding reaction", error });
  }
};

// Remove a reaction from a thought
exports.removeReaction = async (req, res) => {
  try {
    // Assuming reactions is a subdocument schema on Thought model and each reaction has a unique _id
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res.status(404).json({ message: "Thought or reaction not found" });
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ message: "Error removing reaction", error });
  }
};

module.exports = {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
};
