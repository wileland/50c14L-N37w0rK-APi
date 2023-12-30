// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: "Username is required",
    trim: true,
  },
  email: {
    type: String,
    required: "Email is required",
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  // Add thoughts and friends with ref to respective models
  // Next steps: Define the rest of the User schema.
});

const User = mongoose.model("User", userSchema);

module.exports = User;
