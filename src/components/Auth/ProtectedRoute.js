import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/" />; // Redirect unauthorized users home
  }

  return children;
}

export default ProtectedRoute;