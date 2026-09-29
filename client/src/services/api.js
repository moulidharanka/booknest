import axios from 'axios';

// Create an axios instance with the base URL of our backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Automatically attach the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- AUTH API CALLS ---
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// --- BOOK API CALLS ---
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// --- BORROW API CALLS ---
export const borrowBook = (bookId) => api.post('/borrow', { bookId });
export const getMyBorrowed = () => api.get('/borrow/my-books');
export const returnBook = (recordId) => api.put(`/borrow/return/${recordId}`);
export const clearLoanHistory = () => api.delete('/borrow/history');

export default api;