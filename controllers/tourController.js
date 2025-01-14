const fs = require('fs');

// get tours from local file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );

// tours route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requsetTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(400).json({
      status: 'fail',
      message: 'Inavlid Id',
    });
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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

exports.editTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
