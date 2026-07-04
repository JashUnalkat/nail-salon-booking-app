import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Layout & Components
import Layout from './components/Layout/Layout';
import Home from './components/Layout/Home';
import BookingForm from './components/Booking/BookingForm';
import UserAppointments from './components/Appointment/UserAppointment';
import Appointment from './components/Appointment/Appointment'; // Import the new file
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/book" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute>
                <UserAppointments />
              </ProtectedRoute>
            } />

            {/* Staff-Only Route for Appointment Management */}
            <Route path="/appointments" element={
              <ProtectedRoute staffOnly={true}> 
                <Appointment />
              </ProtectedRoute>
            } />

            {/* Admin-Only Route */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;