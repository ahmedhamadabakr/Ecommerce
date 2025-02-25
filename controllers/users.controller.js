const User = require('../models/user.model');
const objectIdSchema = require('../requests/objectId.schema');

const getAllUsers = (req, res) => {
  res.send('Get all users');
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    objectIdSchema.parse({ id });

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        message: 'User not found',
        success: false
      });
      return;
    }

    res.json({
      message: 'User found',
      success: true,
      data: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        gender: user.gender,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
      errors: error
    });
  }
};

const updateUser = (req, res) => {
  res.send('Update user');
};

const deleteUser = (req, res) => {
  res.send('Delete user');
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
