const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/Products.controller");
const isAdmin = require("../middlewares/is-admin");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const productRouter = express.Router();

productRouter.get("/api/products", getAllProducts);

productRouter.get("/api/products/:productId", getProductById);

productRouter.post("/api/products",
   mustBeLoggedIn,
   //isAdmin,
    createProduct);

productRouter.put(
  "/api/products/:productId",
  mustBeLoggedIn,
  isAdmin,
  updateProduct
);

productRouter.delete(
  "/api/products/:productId",
  mustBeLoggedIn,
  isAdmin,
  deleteProduct
);

module.exports = productRouter;
