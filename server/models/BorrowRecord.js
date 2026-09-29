const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Links to the Book model
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to the User model
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true,
    // Default due date is 14 days from today
    default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);