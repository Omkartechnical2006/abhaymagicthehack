const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 2, // Ensures password is at least 6 characters
  },
  message: {
    type: String,
    required: true,
    minlength: 2, // Ensures password is at least 6 characters
  },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
