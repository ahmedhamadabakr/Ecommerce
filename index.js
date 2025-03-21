const express = require("express");
const morgan = require("morgan");
const errorhandler = require("errorhandler");

const app = express();
const port = 8000;

app.use(morgan("dev"));// log all requests to the console in dev mode about the request from the client
app.use(errorhandler());
app.use(express.static("public"));// serve static files from the public directory

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
