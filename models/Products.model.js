const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductsSchema); // User is the name of the collection in the database

module.exports = Product;
