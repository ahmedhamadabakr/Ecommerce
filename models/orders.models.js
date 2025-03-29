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
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  status: { type: String, default: "pending" },
  quantity: {
    type: Number,
    required: true,
    min: 1,
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

// OrdersSchema.pre('save', function(next) {//this is a middleware that will run before the save method
//   this.updated_at = Date.now();
//   next();
// });

const Order = mongoose.model("Order", OrdersSchema);
module.exports = Order;
