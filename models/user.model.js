const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  age: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema); // User is the name of the collection in the database

module.exports = User;
