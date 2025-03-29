const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/authentications.controller");
const mustBeLoggedIn = require("../middlewares/must-be-logged");

const authenticationRouter = express.Router();

authenticationRouter.post("/api/register", register);

authenticationRouter.post("/api/login", login);

authenticationRouter.post("/api/logout",mustBeLoggedIn ,logout);


module.exports = authenticationRouter;
