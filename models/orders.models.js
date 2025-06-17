const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //this is the user id from the user model
    ref: "User", //this is the user model name that we have exported
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { 
        type: Number, 
        required: true, 
        min: 1,
        default: 1 
      },
      productTitle: { type: String, required: true },
      productImages: {
        photo_1: { type: String, default: null },
        photo_2: { type: String, default: null },
        photo_3: { type: String, default: null },
        photo_4: { type: String, default: null },
      }
    },
  ],
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: "pending" 
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the updated_at timestamp before saving
OrdersSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const Order = mongoose.model("Order", OrdersSchema);
module.exports = Order;
