const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Products.controller");

const productRouter = express.Router();

productRouter.get("/api/products", getAllProducts);

productRouter.get("/api/products/:productId", getProductById);

productRouter.post("/api/products", createProduct);

productRouter.put("/api/products/:productId", updateProduct);

productRouter.delete("/api/products/:productId", deleteProduct);

module.exports = productRouter;

