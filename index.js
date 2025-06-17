// Set environment variables
process.env.JWT_SECRET = "your-super-secret-key-123";
process.env.EXPIRES_IN = "7d";

const express = require("express");
const morgan = require("morgan");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const app = express();
const port = 8000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authenticationRouter = require("./routes/authentication.routes");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");
const orederRouter = require("./routes/order.routes");

// Mount routes
app.use("/api", authenticationRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(orederRouter);

// Error handling
app.use(errorhandler());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/posts", (req, res) => {
  console.log(req.body);
  res.send("Hello World!");
});

app.listen(port, async () => {
  try {
    console.log(`Server is running http://localhost:${port}`);

    await mongoose.connect("mongodb://localhost:27017/ecommerce");
    console.log("Connected to the database");
  } catch (error) {
    console.log(error);
  }
});
