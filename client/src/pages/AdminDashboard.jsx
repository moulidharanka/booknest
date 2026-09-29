import { useState, useEffect } from 'react';
import { getBooks, createBook, deleteBook } from '../services/api';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [bookType, setBookType] = useState('loan'); // 'loan' (copyrighted) or 'public_domain' (free read)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    totalCopies: 3,
    publishedYear: new Date().getFullYear(),
    readUrl: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setBookType(type);
    if (type === 'public_domain') {
      setFormData((prev) => ({
        ...prev,
        totalCopies: 999,
        readUrl: prev.readUrl || 'https://www.gutenberg.org/ebooks/',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        totalCopies: 3,
        readUrl: '',
      }));
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...formData,
        readUrl: bookType === 'public_domain' ? formData.readUrl : '',
      };
      await createBook(payload);
      setSuccess(`Book "${formData.title}" added successfully!`);
      setFormData({
        title: '',
        author: '',
        genre: 'Fiction',
        totalCopies: 3,
        publishedYear: new Date().getFullYear(),
        readUrl: '',
        description: '',
      });
      setBookType('loan');
      fetchBooks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleDeleteBook = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteBook(id);
      setSuccess(`Book "${title}" deleted successfully!`);
      fetchBooks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  return (
    <div>
      <h2 className="section-title">👑 Admin Dashboard</h2>

      {/* Add Book Form */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Add New Catalog Book</h3>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleAddBook}>
          {/* Book Type Selector */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', fontSize: '1rem', color: '#2c3e50' }}>Catalog Classification</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="bookTypeRadio"
                  value="loan"
                  checked={bookType === 'loan'}
                  onChange={handleTypeChange}
                />
                <span><strong>🔒 Copyrighted Book</strong> (Library Loan • Account Required)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="bookTypeRadio"
                  value="public_domain"
                  checked={bookType === 'public_domain'}
                  onChange={handleTypeChange}
                />
                <span><strong>🟢 Public Domain</strong> (Free Read Forever • Project Gutenberg)</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Book Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input type="text" name="author" value={formData.author} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select name="genre" value={formData.genre} onChange={handleInputChange}>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Children">Children</option>
                <option value="Classic">Classic</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Published Year</label>
              <input type="number" name="publishedYear" min="1000" max="2030" value={formData.publishedYear} onChange={handleInputChange} required />
            </div>

            {bookType === 'loan' ? (
              <div className="form-group">
                <label>Total Library Copies</label>
                <input type="number" name="totalCopies" min="1" max="100" value={formData.totalCopies} onChange={handleInputChange} required />
              </div>
            ) : (
              <div className="form-group">
                <label>Project Gutenberg / Free Reader URL</label>
                <input
                  type="url"
                  name="readUrl"
                  placeholder="https://www.gutenberg.org/ebooks/1342"
                  value={formData.readUrl}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Synopsis / Description</label>
              <input
                type="text"
                name="description"
                placeholder="Brief summary of the book..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success" style={{ marginTop: '10px' }}>
            ➕ Add Book to Catalog
          </button>
        </form>
      </div>

      {/* Book List */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#2c3e50' }}>Manage Existing Books</h3>
        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Author</th>
                  <th style={{ padding: '12px' }}>Access Type</th>
                  <th style={{ padding: '12px' }}>Availability</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => {
                  const isFree = Boolean(book.readUrl);
                  return (
                    <tr key={book._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontWeight: '600' }}>{book.title}</td>
                      <td style={{ padding: '12px' }}>{book.author}</td>
                      <td style={{ padding: '12px' }}>
                        {isFree ? (
                          <span className="badge-free-read">🟢 Free Read</span>
                        ) : (
                          <span className="badge-library-loan">🔒 Library Loan</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {isFree ? (
                          <span style={{ color: '#234e52', fontWeight: 'bold' }}>Unlimited Access</span>
                        ) : (
                          <span style={{ color: book.availableCopies > 0 ? '#11998e' : '#ee0979', fontWeight: 'bold' }}>
                            {book.availableCopies} / {book.totalCopies} copies
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          onClick={() => handleDeleteBook(book._id, book.title)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}