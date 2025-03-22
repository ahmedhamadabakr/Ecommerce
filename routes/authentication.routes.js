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


module.exports = authenticationRouter;
