import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase/firebaseConfig';
import './Layout.scss';

function Layout({ children }) {
  const { user, role } = useAuth(); 

  return (
    <div className="app-layout">
      <nav className="navbar">
        <h2 className="logo">Ontario Centre Nails and Spa</h2>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/book">Book Now</Link>
          
          {user ? (
            <>
              {/* NEW: Appointment button for Staff/Admin only */}
              {(role === 'admin' || role === 'nail_technician') && (
                <Link to="/appointments">Appointments</Link>
              )}
              
              <Link to="/my-appointments">My Appointments</Link>
              
              {role === 'admin' && <Link to="/admin">Admin Panel</Link>}
              
              <button className="logout-btn" onClick={() => auth.signOut()}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
      <footer className="footer">© 2026 Ontario Centre Nails and Spa</footer>
    </div>
  );
}

export default Layout;