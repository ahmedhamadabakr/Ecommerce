const express = require("express");
const morgan = require("morgan");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const authenticationRouter = require("./routes/authentication.routes");
const usersRouter = require("./routes/users.routes");
const productsRouter = require("./routes/products.routes");

const app = express();
const port = 8000;

app.use(morgan("dev")); // log all requests to the console in dev mode about the request from the client
app.use(errorhandler());
app.use(express.static("public")); // serve static files from the public directory
app.use(express.json()); // parse JSON data from the request body

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(authenticationRouter);
app.use(usersRouter);
app.use(productsRouter);

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
