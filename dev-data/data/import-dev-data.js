const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require("../../models/tourModel")

dotenv.config({ path: './config.env' })

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

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// import data into db
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('data successful loaded')
    } catch (error) {
        console.log(error) 
    }
    process.exit()
}

// delete all data from collection
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('data successful deleted')
    } catch (error) {
        console.log(error) 
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete'){
    deleteData()
}