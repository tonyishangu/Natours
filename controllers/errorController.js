const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  })
}

const sendErrorProd = (err, res) => {
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // 1, log the error
    console.error('Error', err)
    // 2, send a generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}


module.exports = (err, req, res, next) =>{
    // console.log(err.stack)
  
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    
    if(process.env.NODE_ENV === 'development'){
     sendErrorDev(err, res)
    } else if(process.env.NODE_ENV === 'production') {
      let error = {...err}
      if(error.name === 'CastError') error = handleCastErrorDB(error)
     sendErrorProd(error, res)
    }
}  
   