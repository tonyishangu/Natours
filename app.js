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
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
})

module.exports = app
