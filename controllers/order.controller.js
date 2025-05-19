const User = require("../models/user.model");
const Product = require("../models/products.model");
const Order = require("../models/orders.models");
const orderIdschema = require("../requests/orders/order.vaildation");
const mongoose = require("mongoose");


const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // استرجاع الطلبات مع بيانات المستخدم والمنتج
    const orders = await Order.find()
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    if (!orders.length) {
      return res.status(404).json({ message: "No orders yet!" });
    }

    const product = await Product.find();
    const user = await User.find();

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      message: "Orders retrieved successfully",
      data: orders.map((order) => ({
        id: order._id,
        user: user.map((user) => ({
          firstName: user.firstName,
        })), // يعرض معلومات المستخدم
        product: product.map((product) => ({
          title: product.title,
        })), // يعرض معلومات المنتج
        quantity: order.quantity,
        created_at: order.created_at,
      })),
      pagination: {
        totalOrders,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const id = req.params.orderId;
  orderIdschema.parse({ orderId: id });

    // البحث عن الطلب مع تحميل بيانات المستخدم والمنتج
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order found",
      status: "success",
      data: {
        id: order._id,
        quantity: order.quantity,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Create a new order
 * @route POST /products/:productId/orders
 */
const createOrder = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { quantity, userId } = req.body;
    const productId = req.params.productId;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid user ID format" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid product ID format" 
      });
    }

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "Invalid quantity provided. Must be a positive number" 
      });
    }

    // Find user and product
    const [user, product] = await Promise.all([
      User.findById(userId).session(session),
      Product.findById(productId).session(session)
    ]);

    // Validate user and product existence
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        status: "error", 
        message: "User not found" 
      });
    }

    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ 
        status: "error", 
        message: "Product not found" 
      });
    }

    // Check product availability
    if (product.quantity < quantity) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Insufficient stock",
        data: {
          available: product.quantity,
          requested: quantity
        }
      });
    }

    // Calculate order details
    const itemPrice = product.price;
    const totalAmount = itemPrice * quantity;

    // Create order item
    const orderItem = {
      product: product._id,
      quantity: quantity,
      price: itemPrice
    };

    // Create order
    const order = new Order({
      user: userId,
      items: [orderItem],
      totalAmount,
      status: "pending" // Default status
    });

    // Update product quantity
    product.quantity -= quantity;
    
    // Save changes within transaction
    await Promise.all([
      order.save({ session }),
      product.save({ session })
    ]);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: {
        orderId: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        createdAt: order.created_at
      }
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Order creation error:", error);
    return res.status(500).json({ 
      status: "error", 
      message: "Failed to create order",
      error: error.message 
    });
  }
};

/**
 * Update an existing order
 * @route PUT /orders/:orderId
 */
const updateOrder = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { quantity } = req.body;

    // Validate orderId using Zod schema
    try {
      orderIdschema.parse({ orderId });
    } catch (validationError) {
      return res.status(400).json({
        status: "error",
        message: "Invalid order ID format",
        errors: validationError.errors
      });
    }

    // Validate quantity
    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        status: "error", 
        message: "Invalid quantity provided. Must be a positive number"
      });
    }

    // Find order with session
    const order = await Order.findById(orderId).session(session);
    
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Order not found"
      });
    }

    // Get first item from order
    if (!order.items || order.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Order has no items"
      });
    }

    const orderItem = order.items[0];
    const oldQuantity = orderItem.quantity;
    const quantityDifference = quantity - oldQuantity;

    // If no change in quantity, return early
    if (quantityDifference === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        status: "success",
        message: "No changes needed - quantity remains the same",
        data: {
          orderId: order._id,
          quantity: orderItem.quantity,
          totalAmount: order.totalAmount
        }
      });
    }

    // Find product
    const product = await Product.findById(orderItem.product).session(session);
    
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: "error",
        message: "Product not found"
      });
    }

    // Check stock if increasing quantity
    if (quantityDifference > 0 && product.quantity < quantityDifference) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: "error",
        message: "Insufficient stock",
        data: {
          available: product.quantity,
          additionalNeeded: quantityDifference
        }
      });
    }

    // Update product quantity
    product.quantity -= quantityDifference;
    
    // Update order
    orderItem.quantity = quantity;
    order.totalAmount = product.price * quantity;

    // Save changes within transaction
    await Promise.all([
      order.save({ session }),
      product.save({ session })
    ]);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      status: "success",
      message: "Order updated successfully",
      data: {
        orderId: order._id,
        quantity: orderItem.quantity,
        totalAmount: order.totalAmount,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Order update error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update order",
      error: error.message
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const id = req.params.orderId;
    orderIdschema.parse({ orderId: id }); //validate the id

    const user = await Order.findById(id); //find the user by id
    if (!user) {
      res.status(404).send("order not found");
      return;
    }

    await Order.deleteOne({ _id: id });
    res.send("delete order");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
