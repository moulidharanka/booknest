import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// We will create these pages in the next step
import Home from './pages/Home';
import Login from './pages/Login';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <h1>📚 BookNest</h1>
      <div className="nav-links">
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        {user ? (
          <>
            <span style={{ marginLeft: '15px' }}>Hello, {user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginLeft: '15px' }}>Login</Link>
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
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;