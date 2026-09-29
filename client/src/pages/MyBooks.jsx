import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBorrowed, returnBook, clearLoanHistory } from '../services/api';
import ReaderModal from '../components/ReaderModal';

export default function MyBooks() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [selectedReaderBook, setSelectedReaderBook] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const response = await getMyBorrowed();
      // Ensure only valid records with populated books are kept
      const valid = (response.data || []).filter((r) => r && r.book);
      setRecords(valid);
    } catch (err) {
      setError('Failed to load borrowed books. Please login.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (recordId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to return "${bookTitle}"?`)) return;
    try {
      setError('');
      await returnBook(recordId);
      setSuccessMessage(`✅ "${bookTitle}" was returned successfully!`);
      setTimeout(() => setSuccessMessage(''), 5000);
      fetchMyBooks(); // Refreshes records; it will automatically move out of active loans!
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your entire loan history? This cannot be undone.')) return;
    try {
      setClearing(true);
      setError('');
      const res = await clearLoanHistory();
      setSuccessMessage(`🧹 Loan history cleared successfully (${res.data.deletedCount || 0} records removed).`);
      setTimeout(() => setSuccessMessage(''), 5000);
      fetchMyBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear loan history');
    } finally {
      setClearing(false);
    }
  };

  const activeLoans = records.filter((r) => r.status !== 'returned');
  const returnedHistory = records.filter((r) => r.status === 'returned');

  const displayedRecords = activeTab === 'active' ? activeLoans : returnedHistory;

  // Helper to calculate days remaining until due
  const getDueStatus = (dueDateString) => {
    const due = new Date(dueDateString);
    const now = new Date();
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, color: '#e53e3e', isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today!', color: '#dd6b20', isOverdue: false };
    } else {
      return { text: `${diffDays} days remaining`, color: '#319795', isOverdue: false };
    }
  };

  return (
    <div>
      <div className="mybooks-header">
        <h2 className="section-title">🏛️ My Library Loans</h2>
        <p className="mybooks-subtitle">
          Manage your active borrowed books and review past library loans
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {/* Navigation Tabs between Active Loans and Return History */}
      <div className="loans-tabs-container">
        <div className="loans-tabs-left">
          <button
            className={`loan-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Loans <span className="tab-pill">{activeLoans.length}</span>
          </button>
          <button
            className={`loan-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Loan History <span className="tab-pill">{returnedHistory.length}</span>
          </button>
        </div>

        {/* Clear Loan History Button (Visible on History tab when records exist) */}
        {activeTab === 'history' && returnedHistory.length > 0 && (
          <button
            className="btn btn-clear-history"
            onClick={handleClearHistory}
            disabled={clearing}
            title="Remove all past returned loan records"
          >
            {clearing ? '🧹 Clearing...' : '🗑️ Clear Loan History'}
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem', padding: '40px 0' }}>
          Loading your library records...
        </p>
      ) : displayedRecords.length === 0 ? (
        <div className="card empty-loans-card">
          {activeTab === 'active' ? (
            <>
              <h3>No Active Loans</h3>
              <p>You currently do not have any borrowed copyrighted books checked out.</p>
              <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', marginTop: '15px' }}>
                Browse Books to Borrow
              </Link>
            </>
          ) : (
            <>
              <h3>No Return History</h3>
              <p>You have not returned any books yet. Books you return will appear here.</p>
            </>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {displayedRecords.map((record) => {
            const dueStatus = getDueStatus(record.dueDate);
            const isReturned = record.status === 'returned';

            return (
              <div key={record._id} className="book-card loan-card">
                <div className="card-top-row">
                  <span className={`status-tag ${isReturned ? 'returned' : 'active-loan'}`}>
                    {isReturned ? '✓ Returned' : '⏳ Active Loan'}
                  </span>
                  {!isReturned && (
                    <span className="due-status-pill" style={{ color: dueStatus.color }}>
                      {dueStatus.text}
                    </span>
                  )}
                </div>

                {/* Book Thumbnail Cover Banner */}
                <div className="book-card-cover-wrapper">
                  {record.book.coverImage ? (
                    <img
                      src={record.book.coverImage}
                      alt={record.book.title}
                      className="book-thumbnail-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="book-cover-placeholder"
                    style={{ display: record.book.coverImage ? 'none' : 'flex' }}
                  >
                    <span className="placeholder-icon">📖</span>
                    <span className="placeholder-title">{record.book.title}</span>
                  </div>
                </div>

                <div className="book-card-content">
                  <h3 className="book-card-title">{record.book.title}</h3>
                  <p className="book-card-author">by <strong>{record.book.author}</strong></p>

                <div className="loan-meta-box">
                  <div className="loan-meta-row">
                    <span>Borrowed:</span>
                    <strong>{new Date(record.borrowDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="loan-meta-row">
                    <span>{isReturned ? 'Returned On:' : 'Due Date:'}</span>
                    <strong>
                      {isReturned
                        ? (record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'Yes')
                        : new Date(record.dueDate).toLocaleDateString()}
                    </strong>
                  </div>
                </div>

                <div className="loan-actions">
                  <button
                    className="btn btn-read-modal"
                    onClick={() => setSelectedReaderBook(record.book)}
                  >
                    📖 Read Book
                  </button>

                  {!isReturned && (
                    <button
                      className="btn btn-success return-btn"
                      onClick={() => handleReturn(record._id, record.book.title)}
                    >
                      🔄 Return
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedReaderBook && (
        <ReaderModal
          book={selectedReaderBook}
          onClose={() => setSelectedReaderBook(null)}
        />
      )}
    </div>
  );
}