const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    index: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    index: true
  },
   genre: {
    type: [String],
    enum: [
      'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 
      'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Children', 
      'Other', 'Classic', 'Adventure', 'Science Fiction', 'Dystopian', 
      'Horror', 'Philosophy', 'Historical', 'Family'
    ],
    default: ['Other']
  },
  description: {
    type: String,
    maxlength: 2000
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=No+Cover'
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  availableCopies: {
    type: Number,
    min: 0
  },
  publishedYear: {
    type: Number,
    min: 1000,
    max: new Date().getFullYear() + 1
  },
  readUrl: {
    type: String,
    default: '' // We will put Project Gutenberg links here
  }
}, {
  timestamps: true
});

// Using async function WITHOUT next parameter (modern Mongoose way)
bookSchema.pre('save', async function() {
  if (this.availableCopies > this.totalCopies) {
    this.availableCopies = this.totalCopies;
  }
  if (this.availableCopies < 0) {
    this.availableCopies = 0;
  }
});

module.exports = mongoose.model('Book', bookSchema);