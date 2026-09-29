const express = require('express');
const router = express.Router();
const { borrowBook, returnBook, getMyBorrowedBooks, clearLoanHistory } = require('../controllers/borrowController');
const { protect } = require('../middleware/authMiddleware');

// All borrow routes require authentication
router.post('/', protect, borrowBook);
router.put('/return/:id', protect, returnBook);
router.get('/my-books', protect, getMyBorrowedBooks);
router.delete('/history', protect, clearLoanHistory);

module.exports = router;