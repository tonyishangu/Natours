const fs = require('fs');
const express = require('express');

const app = express();

// middlewares
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware')
    next()
})
app.use((req, res, next) => {
    req.requsetTime = new Date().toISOString()
    next()
})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// api functions
const getAllTours = (req, res) => {
  res.status(201).json({
    status: 'Success',
    requestedAt: req.requsetTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(400).json({
      status: 'fail',
      message: 'Inavlid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const editTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(400).json({
      status: 'fail',
      message: 'Inavlid Id',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour: 'Updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

// routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(editTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
