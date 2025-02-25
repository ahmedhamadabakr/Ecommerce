// - Authentication
//   - Register (Signup)
//   - Login (Signin)
//   - Logout

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerSchema = require('../requests/authentication/register.schema');
const loginSchema = require('../requests/authentication/login.schema');
const User = require('../models/user.model');

const register = async (req, res) => {
  try {
    const data = req.body;
    registerSchema.parse(data);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await User.insertOne({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      gender: data.gender,
      address: data.address
    });

    res.json({
      message: 'User registered successfully',
      succes: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
      errors: error
    });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    loginSchema.parse(data);

    const user = await User.findOne({ email: data.email });

    if (!user) {
      res.status(400).json({
        message: 'invalid email or password',
        success: false
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      res.status(400).json({
        message: 'invalid email or password',
        success: false
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({
      id: user._id,
      email: user.email
    }, "secret", { expiresIn: '7d' });

    res.json({
      message: 'User logged in successfully',
      token: token,
      succes: true
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
      errors: e.errors
    });
  }
};

const logout = (req, res) => {
  try {
    // ...

    // Request ->
    // <- Response

    res.json({
      message: 'User logged out successfully',
      succes: true
    });
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
      errors: e.errors
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
