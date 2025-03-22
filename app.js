const express = require('express');
const morgan = require('morgan');

const app = express();

// import routes
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
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // })
  const err = new Error (`Can't find ${req.originalUrl} on this server`)
  err.status = 'Fail'
  err.statusCode = 400

  next(err)

})

app.use((err, req, res, next) =>{
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
})

module.exports = app
