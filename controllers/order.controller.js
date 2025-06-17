const Order = require("../models/orders.models");
const Product = require("../models/Products.model");
const { orderSchema } = require("../requests/orders/order.Schema");

/**
 * @desc Create a new order for a product
 * @route POST /orders/:productId
 * @access Private (User)
 */
const createOrder = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    // Validate request body
    const { quantity } = orderSchema.parse(req.body);

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        data: null,
      });
    }

    // Check if requested quantity is available
    if (product.quantity < quantity) {
      return res.status(400).json({
        message: "Requested quantity not available",
        data: null,
      });
    }

    // Calculate total amount
    const totalAmount = product.price * quantity;

    const order = new Order({
      user: userId,
      products: [{
        product: productId,
        quantity: quantity
      }],
      totalAmount,
      status: "pending"
    });

    await order.save();

    // Update product quantity
    product.quantity -= quantity;
    await product.save();

    return res.status(201).json({
      message: "Order created successfully",
      data: order,
    });

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        message: "Validation error",
        error: err.errors,
        data: null
      });
    }
    return handleServerError(res, err);
  }
};

/**
 * @desc Get all orders for the logged-in user
 * @route GET /orders
 * @access Private (User)
 */
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product")
      .populate("user", "firstName lastName email");

    return res.status(200).json({
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Get specific order by ID (owned by user)
 * @route GET /orders/:orderId
 * @access Private (User)
 */
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    })
      .populate("products.product")
      .populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (err) {
    return handleServerError(res, err);
  }
};

/**
 * @desc Update order status
 * @route PUT /orders/:orderId
 * @access Private (User/Admin)
 */
const updateOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const { status } = orderSchema.parse(req.body);

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user.id },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        message: "Validation error",
        error: err.errors,
        data: null
      });
    }
    return handleServerError(res, err);
  }
};

/**
 * @desc Delete an order
 * @route DELETE /orders/:orderId
 * @access Private (User/Admin)
 */
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    // Return product quantity to inventory
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }

    await order.deleteOne();

    return res.status(200).json({
      message: "Order deleted successfully",
      data: true,
    });
  } catch (err) {
    return handleServerError(res, err);
  }
};

// Reusable server error handler
const handleServerError = (res, error) => {
  console.error(error);
  return res.status(500).json({
    message: "Internal server error",
    error: error.message,
    data: null,
  });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
