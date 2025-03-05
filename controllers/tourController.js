const Tour = require("../models/tourModel")


// tours route handlers
exports.getAllTours = async (req, res) => {
  try{
    const tours = await Tour.find()
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch(err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
};

exports.getTourById = async (req, res) => {
 try {
  const tour = await Tour.findById(req.params.id)
  // Tour.findOne({ _id: req.params.id})
   res.status(201).json({
     status: 'success',
     data: {
       tour,
     },
   });
 } catch (error) {
  res.status(400).json({
    status: 'fail',
    message: 'Invalid ID'
  })
 }

};

exports.createTour = async (req, res) => {
  try{
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
