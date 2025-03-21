const mongoose = require('mongoose')
const slugify = require('slugify')
// const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [80, 'A tour name must have less than or equal to 80 characters'],
      minlength: [3, 'A tour name must have more than 80 characters'],
    //   validate: [validator.isAlpha, 'Tour name must only container characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'Tour should have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Either easy, medium or difficult'
        }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'rating must be above 1.0'],
      max: [5, 'ratings must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
            return val < this.price
        }
    },
             message: 'Discount price ({VALUE}) sould be lower than the regular price'
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
  }, {
    toJSON: {virtuals: true},
    toObject: { virtuals: true }
  });

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7    
  })

//   Document Middleware => runs before .save() and .create()
tourSchema.pre('save', function(next){
    // console.log(this)
    this.slug = slugify(this.name, {lower: true})
    next()
})
// tourSchema.post('save', function(doc, next){
//     console.log(doc)
//     next()
// })

// Querry middleware
tourSchema.pre(/^find/, function(next){
// tourSchema.pre('find', function(next){
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next()
})

// Aggregation middleware
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true} }
    })
    console.log(this.pipeline())
    next()
})

  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour