// const { default: mongoose } = require('mongoose');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price,summary,difficulty';
  next();
};

// tours route handlers
exports.getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  
  const tours = await features.query;
  // SEND RESPONCE
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if(!tour){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // try {
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err,
  //   });
  // }
});

exports.editTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!tour){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
  // try {
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError('No tour found with that Id', 404))
  }
  res.status(204).json({
    status: 'Success',
    data: null,
  });
  // try {
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: {$gte: 4.5} }
    },
    {
      $group: {
        _id: {$toUpper:'$difficulty'},
        // _id: '$difficulty',
        numTours: {$sum: 1},
        numRatings: {$sum: '$ratingsQuantity'},
        avgRating: { $avg: '$ratingsAverage'},
        avgPrice: { $avg: '$price'},
        avgMinPrice: { $min: '$price'},
        avgMaxPrice: { $max: '$price'},
      }
    },
    {
      $sort: { avgPrice: 1}
    },
    // {
    //   $match: { _id: {$ne: 'EASY'}}
    // }
  ])
  res.status(200).json({
    status: 'success',
    data:{
      stats
    }
  })
  // try {

  // } catch(err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   })
  // }
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates:{
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id:  { $month:'$startDates'},
        numTourStarts: {$sum: 1},
        tours: {$push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {numTourStarts: -1}
    },
    {
      $limit: 12
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  })
  // try {
  // } catch(err){
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err
  //   })
  // }
})