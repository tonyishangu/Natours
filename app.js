const express = require('express');
const morgan = require('morgan');

const app = express();

// import routes
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./Routes/tourRoutes')
const usersRouter = require('./Routes/userRoutes')


// middlewares
app.use(express.json());
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`))
app.use((req, res, next) => {
  req.requsetTime = new Date().toISOString();
  next();
});

// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', usersRouter)

app.all('*',(req,res,next) => {
  
  // const err = new Error (`Can't find ${req.originalUrl} on this server`)
  // err.status = 'Fail'
  // err.statusCode = 400

  next(new AppError(`Can't find ${req.originalUrl} on this server`))

})

app.use(globalErrorHandler)

module.exports = app
