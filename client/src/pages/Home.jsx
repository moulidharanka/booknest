import { useEffect, useState, useContext, useMemo } from 'react';
import { getBooks, borrowBook } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ReaderModal from '../components/ReaderModal';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReaderBook, setActiveReaderBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [accessFilter, setAccessFilter] = useState('all'); // 'all', 'free', 'borrow'
  const [borrowNotice, setBorrowNotice] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (book) => {
    if (!user) {
      alert('Please log in with your BookNest account to borrow copyrighted library books!');
      return;
    }
    try {
      await borrowBook(book._id);
      setBorrowNotice(`🎉 Successfully borrowed "${book.title}"! Due in 14 days. Find it in "My Books".`);
      setTimeout(() => setBorrowNotice(''), 6000);
      fetchBooks(); // Refresh available copy counts
    } catch (error) {
      alert(error.response?.data?.message || 'Error borrowing book');
    }
  };

  // Derive unique genres for quick filter tabs
  const allGenres = useMemo(() => {
    const genreSet = new Set(['All']);
    books.forEach((b) => {
      if (Array.isArray(b.genre)) {
        b.genre.forEach((g) => genreSet.add(g));
      }
    });
    return Array.from(genreSet);
  }, [books]);

  // Counts for access filter
  const freeCount = useMemo(() => books.filter((b) => Boolean(b.readUrl)).length, [books]);
  const borrowCount = useMemo(() => books.filter((b) => !b.readUrl).length, [books]);

  // Filter books dynamically based on search, access filter, and genre
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre =
        selectedGenre === 'All' || (b.genre && b.genre.includes(selectedGenre));

      const matchesAccess =
        accessFilter === 'all' ||
        (accessFilter === 'free' && Boolean(b.readUrl)) ||
        (accessFilter === 'borrow' && !b.readUrl);

      return matchesSearch && matchesGenre && matchesAccess;
    });
  }, [books, searchQuery, selectedGenre, accessFilter]);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h2>📚 Discover, Read & Borrow with BookNest</h2>
        <p>
          Instant free access to timeless public domain classics, plus a curated lending collection of copyrighted titles.
        </p>

        {/* Dual Mode Explainer Cards */}
        <div className="catalog-modes-banner">
          <div className="mode-pill free-pill">
            <span className="mode-icon">🟢</span>
            <div>
              <strong>Read Free</strong>
              <span>Public domain classics • Free forever • Zero restrictions</span>
            </div>
          </div>
          <div className="mode-pill loan-pill">
            <span className="mode-icon">🔒</span>
            <div>
              <strong>Borrow Loans</strong>
              <span>Copyrighted library titles • 14-day loans • Account required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Borrow Success Banner */}
      {borrowNotice && (
        <div className="success-banner" style={{ marginBottom: '20px' }}>
          {borrowNotice}
        </div>
      )}

      {/* Interactive Controls Bar: Access Filter, Search & Genre Filters */}
      <div className="filter-controls-container">
        {/* Top Filter Row: Access Type Selector & Search */}
        <div className="filter-primary-row">
          {/* Access Filter Tabs */}
          <div className="access-tab-group">
            <button
              className={`access-tab-btn ${accessFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAccessFilter('all')}
            >
              All Books <span className="tab-pill">{books.length}</span>
            </button>
            <button
              className={`access-tab-btn ${accessFilter === 'free' ? 'active' : ''}`}
              onClick={() => setAccessFilter('free')}
            >
              🟢 Read Free <span className="tab-pill">{freeCount}</span>
            </button>
            <button
              className={`access-tab-btn ${accessFilter === 'borrow' ? 'active' : ''}`}
              onClick={() => setAccessFilter('borrow')}
            >
              🔒 Library Loans <span className="tab-pill">{borrowCount}</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div className="genre-pill-list">
          <span className="genre-pill-title">Genres:</span>
          {allGenres.map((genre) => (
            <button
              key={genre}
              className={`genre-pill ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="catalog-header">
        <h2 className="section-title">
          {accessFilter === 'free'
            ? '🟢 Public Domain Classics (Free Read)'
            : accessFilter === 'borrow'
            ? '🔒 Copyrighted Books (Library Loans)'
            : 'All Catalog Books'}
          <span className="count-badge">({filteredBooks.length})</span>
        </h2>
      </div>

      {loading ? (
        <p style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem', padding: '40px 0' }}>
          Loading books...
        </p>
      ) : filteredBooks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            No books found matching your current search and filters.
          </p>
          <button
            className="btn btn-primary"
            style={{ width: 'auto', marginTop: '15px' }}
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setAccessFilter('all');
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => {
            const isFreeRead = Boolean(book.readUrl);

            return (
              <div
                key={book._id}
                className={`book-card interactive-card ${isFreeRead ? 'card-free-read' : 'card-library-loan'}`}
              >
                {/* Top Badge: Clearly states Free Read vs Library Loan */}
                <div className="card-top-row">
                  <span className="genre-label">{book.genre?.slice(0, 2).join(' • ')}</span>
                  {isFreeRead ? (
                    <span className="badge-free-read" title="Free forever with no checkout restrictions">
                      🟢 Free Forever
                    </span>
                  ) : (
                    <span className="badge-library-loan" title="Copyrighted title requiring library loan">
                      🔒 Library Loan
                    </span>
                  )}
                </div>

                {/* Book Thumbnail Cover Banner */}
                <div className="book-card-cover-wrapper">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
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
                    style={{ display: book.coverImage ? 'none' : 'flex' }}
                  >
                    <span className="placeholder-icon">📖</span>
                    <span className="placeholder-title">{book.title}</span>
                  </div>
                </div>

                <div className="book-card-content">
                  <h3 className="book-card-title">{book.title}</h3>
                  <p className="book-card-author">by <strong>{book.author}</strong></p>

                  {book.description && (
                    <p className="book-card-description">
                      {book.description.length > 115
                        ? `${book.description.substring(0, 115)}...`
                        : book.description}
                    </p>
                  )}

                {/* Meta details */}
                <div className="book-card-meta">
                  <span>📅 {book.publishedYear}</span>
                  {isFreeRead ? (
                    <span className="meta-free-tag">🌐 Unlimited Access</span>
                  ) : (
                    <span>
                      <strong>Copies:</strong>{' '}
                      <span
                        style={{
                          color: book.availableCopies > 0 ? '#11998e' : '#ee0979',
                          fontWeight: 'bold',
                        }}
                      >
                        {book.availableCopies} / {book.totalCopies}
                      </span>
                    </span>
                  )}
                </div>

                {/* Action Button: Dedicated to the book's model! */}
                <div className="book-card-actions-single">
                  {isFreeRead ? (
                    <button
                      className="btn btn-free-read"
                      onClick={() => setActiveReaderBook(book)}
                    >
                      📖 Read Free (Instant Access)
                    </button>
                  ) : (
                    <button
                      className={`btn ${book.availableCopies > 0 ? 'btn-primary' : 'btn-danger'}`}
                      onClick={() => handleBorrow(book)}
                      disabled={book.availableCopies === 0}
                    >
                      {book.availableCopies === 0 ? '❌ Out of Stock' : '📥 Borrow Loan (14 Days)'}
                    </button>
                  )}
                </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct E-Reader Modal for Free Public Domain Books */}
      {activeReaderBook && (
        <ReaderModal
          book={activeReaderBook}
          onClose={() => setActiveReaderBook(null)}
        />
      )}
    </div>
  );
}