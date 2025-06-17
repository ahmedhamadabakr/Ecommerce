const productsSchema = require("../requests/products/products.schema");
const productIdschema = require("../requests/products/product.validation");
const Product = require("../models/Products.model");

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (!products) {
      res.status(404).send("No products found");
      return;
    }

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      message: "Products retrieved successfully",
      data: products.map((product) => ({
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price,
        category: product.category,
        categoryImage: product.categoryImage,
        quantity: product.quantity,
      })),
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: false,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id });

    const isProduct = await Product.findById(id);
    console.log(isProduct);

    if (!isProduct) {
      res.status(404).send("User not found");
      return;
    }

    res.status(200).json({
      message: "User found",
      status: "success",
      data: {
        title: isProduct.title,
        description: isProduct.description,
        categoryImage: isProduct.categoryImage,
        category: isProduct.category,
        quantity: isProduct.quantity,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const data = productsSchema.parse(req.body);

    const newProduct = await Product.create({
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      categoryImage: data.categoryImage,
      quantity: data.quantity,
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      error: error.message,
      data: false,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id });
    const data = req.body;
    productsSchema.parse(data);
    const cheackproduct = await Product.findById(id);
    if (!cheackproduct) {
      res.status(404).send("Product not found");
      return;
    }
    await Product.updateOne({ _id: id }, { $set: { ...req.body } });
    const product = await Product.findById(id);

    res.status(200).json({
      message: "Product updated",
      status: "success",
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        categoryImage: product.categoryImage,
        category: product.category,
        quantity: product.quantity,
      },
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    productIdschema.parse({ productId: id }); //validate the id

    const user = await Product.findById(id); //find the user by id
    if (!user) {
      res.status(404).send("product not found");
      return;
    }

    await Product.deleteOne({ _id: id });
    res.send("delete product");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
