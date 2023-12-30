// routes/thoughtRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../controllers/thoughtController");

// Route to get all thoughts
router.get("/", getAllThoughts);

// Route to get a single thought by id
router.get("/:id", getThoughtById);

// Route to create a new thought
router.post("/", createThought);

// Route to update a thought by id
router.put("/:id", updateThought);

// Route to delete a thought by id
router.delete("/:id", deleteThought);

// Route to add a reaction to a thought
router.post("/:thoughtId/reactions", addReaction);

// Route to remove a reaction from a thought
router.delete("/:thoughtId/reactions/:reactionId", removeReaction);

module.exports = router;
