const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, min: 2, max: 255 },
  lastname: { type: String, required: true, min: 2, max: 255 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 8, max: 255 },
  gender: { type: String, enum: ['male', 'female'] },
  address: { type: String, max: 255 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
