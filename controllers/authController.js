const { promisify } = require('util');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }
  // if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // getting token and checkif it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token)
  if (!token) {
    return next(
      new AppError('User not logged in, please login to view tours', 401),
    );
  }
  // verfication token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user no longer exists', 401));
  }
  // check if user changed password after the token was issued
  if(freshUser.changesPasswordAfter(decoded.iat)){
    return next(new AppError('Password Changed, please log in again', 401))
  }

//   grant access to protected routes
req.user = freshUser
  next();
});
