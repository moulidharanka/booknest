const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

// @desc    Borrow a book
// @route   POST /api/borrow
// @access  Private
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Public Domain books are free to read anytime with no restrictions
    if (book.readUrl) {
      return res.status(400).json({ 
        message: 'This book is in the public domain and free to read forever! No library loan needed.' 
      });
    }

    // Check if user already has an active loan for this book
    const existingLoan = await BorrowRecord.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed'
    });

    if (existingLoan) {
      return res.status(400).json({ 
        message: 'You already have an active loan for this book. Check "My Books".' 
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available to borrow right now' });
    }

    // Create borrow record
    const borrowRecord = await BorrowRecord.create({
      book: bookId,
      user: userId,
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({
      message: 'Book borrowed successfully',
      borrowRecord,
      availableCopies: book.availableCopies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/borrow/return/:id
// @access  Private
const returnBook = async (req, res) => {
  try {
    const recordId = req.params.id;
    const userId = req.user._id;

    const borrowRecord = await BorrowRecord.findById(recordId);

    if (!borrowRecord) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }

    // Check if the record belongs to the current user
    if (borrowRecord.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to return this book' });
    }

    if (borrowRecord.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Update record
    borrowRecord.status = 'returned';
    borrowRecord.returnDate = Date.now();
    await borrowRecord.save();

    // Increase available copies
    const book = await Book.findById(borrowRecord.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({
      message: 'Book returned successfully',
      borrowRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's borrowed books
// @route   GET /api/borrow/my-books
// @access  Private
// @desc    Get current user's borrowed books
// @route   GET /api/borrow/my-books
// @access  Private
const getMyBorrowedBooks = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ user: req.user._id })
      .populate('book', 'title author coverImage readUrl genre publishedYear')
      .sort({ borrowDate: -1 });

    // Clean up / filter out orphan records if a book was removed from DB
    const validRecords = records.filter((r) => r.book !== null);

    res.json(validRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } // <--- Added closing brace for catch
};  // <--- Added closing brace for function

// @desc    Clear user's returned loan history
// @route   DELETE /api/borrow/history
// @access  Private
const clearLoanHistory = async (req, res) => {
  try {
    const result = await BorrowRecord.deleteMany({
      user: req.user._id,
      status: 'returned'
    });

    res.json({
      message: 'Loan history cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { borrowBook, returnBook, getMyBorrowedBooks, clearLoanHistory };