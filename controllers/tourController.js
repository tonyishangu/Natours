const fs = require('fs');

// get tours from local file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );

// middlewares
exports.checkId = (req, res, next, val) => {
  console.log(val)
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: 'fail',
      message: 'Inavalid ID'
    })
  }
  next()
}
exports.checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price){
    return res.status(404).json({
      status: 'Fail',
      message: 'Missing name or price'
    })
  }
  next()
}

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
  res.status(200).json({
    status: 'Success',
    data: {
      tour: 'Updated tour',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
