const fs = require('fs');
const express = require('express');

const app = express();

// middlewares
app.use(express.json())

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get all
app.get('/api/v1/tours', (req, res) => {
  res.status(201).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// get one by id
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    if(!tour){
        res.status(400).json({
            status: 'fail',
            message: 'Inavlid Id'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

// create new
app.post('/api/v1/tours', (req, res) => {
//   console.log(req.body)
const newId = tours[tours.length - 1].id + 1
const newTour = Object.assign({ id: newId}, req.body)
tours.push(newTour)
fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})
});

// edit a tour
app.patch('/api/v1/tours/:id', (req, res) => {
    if(req.params.id * 1 > tours.length){
        res.status(400).json({
            status: 'fail',
            message: 'Inavlid Id'
        })
    }
    res.status(200).json({
        status: 'Success',
        data: {
            tour: 'Updated tour'
        }
    })
})

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
