const User = require("../models/user.model");
const objectIdschema = require("../requests/objectId");

const getAllUsers = (req, res) => {
  res.send("get all users");
};

const getUserById = async (req, res) => {
  const id = req.params.userId;
  objectIdschema.parse({ userId: id });

  const isUser = await User.findById(id);
  console.log(isUser);
  if (!isUser) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).json({
    message: "User found",
    status: "success",
    data: {
      email: isUser.email,
      firstName: isUser.firstName,
      lastName: isUser.lastName,
    },
  });

  res.send("get user by id");
};

const updateUser = (req, res) => {
  res.send("update user");
};

const deleteUser = (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
