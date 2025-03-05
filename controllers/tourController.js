const Tour = require("../models/tourModel")


// tours route handlers
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requsetTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTourById = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);

  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  try{
    // const newTour = new Tour({})
    // newTour.save()
    const newTour = await Tour.create(req.body)
  
        res.status(201).json({
          status: 'success',
          data: {
            tour: newTour,
          },
        });
      } catch (err){
        res.status(400).json({
          status: 'failed',
          message: 'invalid data sent'
        })
      }
    }

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
