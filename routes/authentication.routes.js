const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authentications.controller");

const authenticationRouter = express.Router();

authenticationRouter.post("/api/register", register);

authenticationRouter.post("/api/login", login);

authenticationRouter.post("/api/logout", logout);

// authenticationRouter.get("/api/users", (req, res) => {
//   res.send("Hello World!");
// });

// authenticationRouter.get("/api/users/:postId", (req, res) => {
//   res.send("Hello World!");
// });

module.exports = authenticationRouter;
