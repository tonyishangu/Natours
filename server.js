const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception, shuting down ...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => {
    // console.log(con.connections)
    console.log('DB connection successful');
  });

// start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejections', err => {
  console.log('UnhandledRejection')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

// console.log(xy)

