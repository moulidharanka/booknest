import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  return children;
}