const User = require("../models/user.model");
const Product = require("../models/products.model");
const Order = require("../models/orders.models");
const orderIdschema = require("../requests/orders/order.vaildation");

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

const createOrder = async (req, res) => {
  try {
    const { quantity, userId } = req.body;
    const products = req.params.productId;

    if (!quantity || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let totalAmount = 0;
    const orderItems = [];

    const product = await Product.findById(products);

    if (!product) {
      return res
        .status(404)
        .json({ message: `Product not found: ${products}` });
    }

    if (products.stock < products.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for product: ${products}`,
      });
    }

    const itemTotal = products.price * products.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
    product.stock -= item.quantity;
    await product.save();

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
    });

    await order.save();
    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const id = req.params.orderId;
    orderIdschema.parse({ orderId: id });

    const orderId = await Order.findById(id);
    if (!orderId) {
      res.status(404).send("order not found");
      return;
    }

    const oldQuantity = orderId.quantity;
    console.log(oldQuantity);

    await Order.updateOne({ _id: id }, { $set: { ...req.body } });
    const orderUpdate = await Order.findById(id);

    const newQuantity = orderUpdate.quantity;
    console.log(newQuantity);

    const newValue = newQuantity - oldQuantity;
    const oldBig = oldQuantity - newQuantity;

    const resolvedProducts = [
      {
        product: orderUpdate.product,
        quantity: orderUpdate.quantity,
        oldBig,
        newValue,
      },
    ];
    if (newQuantity > oldQuantity) {
      for (const p of resolvedProducts) {
        await Product.updateOne(
          { _id: p.product },
          { $inc: { quantity: -p.newValue } }
        );
      }
    }

    if (newQuantity < oldQuantity) {
      for (const p of resolvedProducts) {
        await Product.updateOne(
          { _id: p.product },
          { $inc: { quantity: p.oldBig } }
        );
      }
    }
    res.status(200).json({
      message: "Order Update success",
      status: "success",
      data: {
        id: orderUpdate._id,
        quantity: orderUpdate.quantity,
        created_at: orderUpdate.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
