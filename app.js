const express = require('express');
const morgan = require('morgan');

// import routes
const tourRouter = require('./Routes/tourRoutes')
const usersRouter = require('./Routes/userRoutes')


const app = express();

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.requsetTime = new Date().toISOString();
  next();
});


// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app
