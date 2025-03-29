const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfing = require("../config/jwt");

const {
  registerSchema,
} = require("../requests/authentication/regester.Schema");
const { loginSchema } = require("../requests/authentication/login.Schema");
const User = require("../models/user.model");
const saltRounds = 10;

const register = async (req, res) => {
  try {
    const data = req.body;
    registerSchema.parse(data); // validate the request body
    const hashPassword = await bcrypt.hash(data.password, saltRounds);

    await User.insertOne({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashPassword,
      gender: data.gender,
      address: data.address,
      age: data.age,
      phone: data.phone,
    });

    res.json({
      message: "User registered successfully",
      data: true,
    });

    console.log(req.body);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      errors: error.errors || error.errorResponse.errmsg,
    });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    loginSchema.parse(data);

    const user = await User.findOne({ email: data.email });

    if (!user) {
      res.status(400).json({
        message: "Invalid email or password",
        data: false,
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      res.status(400).json({
        message: "Invalid email or password",
        data: false,
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtConfing.secret,
      {
        expiresIn: "7h",
      }
    );

    res.json({
      message: "User registered successfully",
      token: token,
      data: true,
    });

    res.send("login");
  } catch (error) {
    res.status(500).json({
      message: error.message,
      errors: error.errors,
    });
    console.log(error);
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({
      message: "User logged out successfully",
      data: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      errors: error.errors,
    });
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};
