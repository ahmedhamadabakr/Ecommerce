// - Authentication
//   - Register (Signup)
//   - Login (Signin)
//   - Logout

const express = require('express');
const authenticationController = require('../controllers/authentication.controller');
const authenticationRouter = express.Router();

authenticationRouter.post('/api/register', authenticationController.register);

authenticationRouter.post('/api/login', authenticationController.login);

authenticationRouter.post('/api/logout', authenticationController.logout);

module.exports = authenticationRouter;
