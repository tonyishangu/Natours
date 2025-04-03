const User = require('../models/usermodel')
const catchAsync = require('../utils/catchAsync')

// users route handlers
exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find()

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    })
  });
  exports.createUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'Route not defined',
    });
  };
  exports.getUsersById = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'Route not defined',
    });
  };
  exports.editUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'Route not defined',
    });
  };
  exports.deleteUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'Route not defined',
    });
  };