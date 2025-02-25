// - Users
//   - Get all users (Pagination)
//   - Get user by id
//   - Update user
//   - Delete user

const express = require('express');
const usersController = require('../controllers/users.controller');
const userRouter = express.Router();

userRouter.get('/api/users', usersController.getAllUsers);

userRouter.get('/api/users/:id', usersController.getUserById);

userRouter.put('/api/users/:id', usersController.updateUser);

userRouter.delete('/api/users/:id', usersController.deleteUser);

module.exports = userRouter;
