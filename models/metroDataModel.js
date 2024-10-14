const mongoose = require('mongoose');

// Define the schema for Metro Data
const metroSchema = new mongoose.Schema(
  {
    stationName: {
      type: String,
      required: [true, 'A metro station must have a name'],
      trim: true
    },
    location: {
      type: {
        lat: { type: Number, required: [true, 'A station must have a latitude'] },
        lng: { type: Number, required: [true, 'A station must have a longitude'] }
      },
      required: true
    },
    line: {
      type: String, // Name of the metro line
      required: [true, 'A metro station must be part of a line'],
    },
    isOperational: {
      type: Boolean, // Whether the metro station is operational or under construction
      default: true,
    },
    openDate: {
      type: Date, // Date when the metro station was opened
      required: [true, 'A metro station must have an opening date']
    },
    secretStation: {
      type: Boolean, // Used to hide certain stations from general queries
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property to format location as a string
metroSchema.virtual('formattedLocation').get(function() {
  return `${this.location.lat}, ${this.location.lng}`;
});

// Document Middleware: Automatically generate a slug for station name before saving the document
metroSchema.pre('save', function(next) {
  this.slug = slugify(this.stationName, { lower: true });
  next();
});

// Query Middleware: Exclude secret stations from any query results
metroSchema.pre(/^find/, function(next) {
  this.find({ secretStation: { $ne: true } });
  this.start = Date.now();
  next();
});

// Post Query Middleware: Log the query execution time
metroSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation Middleware: Exclude secret stations from aggregation results
metroSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretStation: { $ne: true } } });
  next();
});

// Create a Model from the Schema
const MetroStation = mongoose.model('MetroStation', metroSchema);

module.exports = MetroStation;
