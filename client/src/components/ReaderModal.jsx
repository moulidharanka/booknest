import { useState, useEffect, useMemo } from 'react';
import { getBookChapters } from '../services/bookContents';

export default function ReaderModal({ book, onClose }) {
  const [fontSize, setFontSize] = useState(16);
  const [readerTheme, setReaderTheme] = useState('light'); // 'light', 'sepia', 'dark'
  const [activeTab, setActiveTab] = useState('reader'); // 'reader' or 'summary'
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Load chapters for this book
  const chapters = useMemo(() => {
    return getBookChapters(book);
  }, [book]);

  useEffect(() => {
    // Reset to first chapter whenever book changes
    setCurrentChapterIndex(0);
  }, [book]);

  useEffect(() => {
    // Disable background scroll when modal open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!book) return null;

  // Derive Gutenberg direct HTML reader link if applicable
  // e.g. https://www.gutenberg.org/ebooks/1342 -> https://www.gutenberg.org/files/1342/1342-h/1342-h.htm or https://www.gutenberg.org/cache/epub/1342/pg1342-images.html
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/ebooks\/(\d+)/);
    if (match && match[1]) {
      const id = match[1];
      // Gutenberg provides standard modern web-friendly reading link at /cache/epub/<id>/pg<id>-images.html
      return `https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.html`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(book.readUrl);

  const themeStyles = {
    light: { bg: '#ffffff', text: '#2d3748', border: '#e2e8f0', headerBg: '#f8fafc' },
    sepia: { bg: '#fbf0d9', text: '#5f4b32', border: '#e8d7be', headerBg: '#f4e4c1' },
    dark: { bg: '#1a202c', text: '#e2e8f0', border: '#2d3748', headerBg: '#171923' },
  };

  const currentTheme = themeStyles[readerTheme];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="reader-modal-container" 
        onClick={(e) => e.stopPropagation()}
        style={{ background: currentTheme.bg, color: currentTheme.text }}
      >
        {/* Top Header / Action Bar */}
        <div className="reader-modal-header" style={{ background: currentTheme.headerBg, borderColor: currentTheme.border }}>
          <div className="reader-title-area">
            <span className="reader-badge">📖 E-Reader Mode</span>
            <h3>{book.title}</h3>
            <span className="reader-author">by {book.author}</span>
          </div>

          <div className="reader-controls">
            {/* View Mode Toggle */}
            <div className="reader-tab-group">
              <button 
                className={`reader-btn-tab ${activeTab === 'reader' ? 'active' : ''}`}
                onClick={() => setActiveTab('reader')}
              >
                Full Text
              </button>
              <button 
                className={`reader-btn-tab ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Overview
              </button>
            </div>

            {/* Reader Theme switcher */}
            <div className="reader-theme-buttons">
              <button 
                title="Light Theme"
                className={`theme-dot dot-light ${readerTheme === 'light' ? 'selected' : ''}`} 
                onClick={() => setReaderTheme('light')}
              />
              <button 
                title="Sepia Theme"
                className={`theme-dot dot-sepia ${readerTheme === 'sepia' ? 'selected' : ''}`} 
                onClick={() => setReaderTheme('sepia')}
              />
              <button 
                title="Dark Theme"
                className={`theme-dot dot-dark ${readerTheme === 'dark' ? 'selected' : ''}`} 
                onClick={() => setReaderTheme('dark')}
              />
            </div>

            {/* Font size adjustments */}
            <div className="reader-font-controls">
              <button 
                className="reader-icon-btn" 
                title="Decrease font" 
                onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
              >
                A-
              </button>
              <span className="font-size-label">{fontSize}px</span>
              <button 
                className="reader-icon-btn" 
                title="Increase font" 
                onClick={() => setFontSize((prev) => Math.min(26, prev + 2))}
              >
                A+
              </button>
            </div>

            {/* Open Gutenberg directly */}
            {book.readUrl && (
              <a 
                href={book.readUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="reader-external-link"
                title="Open directly in Project Gutenberg"
              >
                ↗ External
              </a>
            )}

            {/* Close Button */}
            <button className="reader-close-btn" onClick={onClose} aria-label="Close Reader">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="reader-modal-body">
          {activeTab === 'reader' ? (
            embedUrl ? (
              <div className="iframe-wrapper">
                <iframe
                  src={embedUrl}
                  title={`${book.title} reader`}
                  className="reader-iframe"
                  sandbox="allow-same-origin allow-scripts allow-popups"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="reader-loan-viewer" style={{ fontSize: `${fontSize}px` }}>
                <div className="loan-reader-header-card">
                  <div className="loan-reader-badge">🔒 Active Digital Library Loan</div>
                  <h2>{book.title}</h2>
                  <p className="loan-reader-author">by <strong>{book.author}</strong> • {book.publishedYear}</p>
                  
                  {/* Chapter Selector Dropdown / Bar */}
                  <div className="chapter-navigation-bar">
                    <span className="chapter-nav-label">Select Chapter:</span>
                    <select
                      className="chapter-dropdown"
                      value={currentChapterIndex}
                      onChange={(e) => setCurrentChapterIndex(Number(e.target.value))}
                    >
                      {chapters.map((ch, idx) => (
                        <option key={idx} value={idx}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                    <span className="chapter-count-label">
                      Chapter {currentChapterIndex + 1} of {chapters.length}
                    </span>
                  </div>
                </div>

                <div className="loan-reader-content">
                  {chapters[currentChapterIndex] ? (
                    <div className="loan-reader-chapter">
                      <h3>{chapters[currentChapterIndex].title}</h3>
                      <div className="chapter-text-body">
                        {chapters[currentChapterIndex].content.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Previous / Next Chapter Buttons */}
                      <div className="chapter-pagination-controls">
                        <button
                          className="btn btn-secondary chapter-prev-btn"
                          disabled={currentChapterIndex === 0}
                          onClick={() => {
                            setCurrentChapterIndex((prev) => Math.max(0, prev - 1));
                            document.querySelector('.reader-loan-viewer')?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          ⬅️ Previous Chapter
                        </button>
                        <span className="chapter-progress-pill">
                          {Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}% Completed
                        </span>
                        <button
                          className="btn btn-primary chapter-next-btn"
                          disabled={currentChapterIndex === chapters.length - 1}
                          onClick={() => {
                            setCurrentChapterIndex((prev) => Math.min(chapters.length - 1, prev + 1));
                            document.querySelector('.reader-loan-viewer')?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          Next Chapter ➡️
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="loan-reader-details-box">
                    <h4>Library Loan Status</h4>
                    <ul>
                      <li><strong>Volume:</strong> {book.title} (Authorized Digital Loan)</li>
                      <li><strong>Duration:</strong> 14 Days from checkout</li>
                      <li><strong>Total Chapters Available:</strong> {chapters.length} chapters loaded</li>
                      <li><strong>Status:</strong> Active & verified for account</li>
                    </ul>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="reader-summary-tab" style={{ fontSize: `${fontSize}px` }}>
              <div className="summary-layout">
                {book.coverImage && (
                  <div className="summary-cover">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                  </div>
                )}
                <div className="summary-details">
                  <h2>{book.title}</h2>
                  <p className="summary-author">By <strong>{book.author}</strong> ({book.publishedYear || 'N/A'})</p>
                  
                  <div className="summary-genres">
                    {book.genre?.map((g) => (
                      <span key={g} className="genre-tag">{g}</span>
                    ))}
                  </div>

                  <div className="summary-section">
                    <h4>About this Book</h4>
                    <p>{book.description || 'No synopsis available for this volume.'}</p>
                  </div>

                  <div className="summary-meta-grid">
                    <div>
                      <strong>Available Copies:</strong> {book.availableCopies} of {book.totalCopies}
                    </div>
                    <div>
                      <strong>Public Domain:</strong> {book.readUrl ? 'Yes (Project Gutenberg)' : 'In Library Collection'}
                    </div>
                  </div>

                  {book.readUrl && (
                    <button 
                      className="btn btn-primary" 
                      style={{ marginTop: '20px', width: 'auto' }}
                      onClick={() => setActiveTab('reader')}
                    >
                      Start Reading Now 📖
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
