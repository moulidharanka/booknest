import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Logo from './components/Logo';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import MyBooks from './pages/MyBooks'; // <-- Import the new page
import AdminRoute from './components/AdminRoute';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Logo size={36} />
        <h1>BookNest</h1>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        
        {/* Show My Books link only if logged in */}
        {user && <Link to="/my-books">My Books</Link>}
        
        {/* Show Admin link only if user is admin */}
        {user && user.role === 'admin' && (
          <Link to="/admin">Admin Dashboard</Link>
        )}
        
        {user ? (
          <>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>
              Hello, {user.name}
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-books" element={<MyBooks />} /> {/* <-- Add the route */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;