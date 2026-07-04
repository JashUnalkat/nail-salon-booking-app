import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

function UserAppointments() {
  const [bookings, setBookings] = useState([]);
  const { user, role, isTechnician } = useAuth(); 

  useEffect(() => {
    const getBookings = async () => {
      if (!user) return;

      const apptRef = collection(db, "appointments");
      let q;

      // Filter logic: 
      // Admin sees all, Technician sees assigned, Customer sees own
      if (role === 'admin') {
        q = apptRef; 
      } else if (isTechnician) {
        // NOTE: Make sure your BookingForm saves the technician NAME, not email, 
        // to match your 'technician' field in Firestore.
        q = query(apptRef, where("technician", "==", user.displayName)); 
      } else {
        q = query(apptRef, where("email", "==", user.email)); 
      }

      const data = await getDocs(q);
      setBookings(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getBookings();
  }, [user, role, isTechnician]);

  return (
    <div className="appointments-container">
      <h2>{role === 'admin' ? "All Bookings" : "My Appointments"}</h2>
      {bookings.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        bookings.map(b => (
          <div key={b.id} className="appointment-card">
            <h3>Service: {b.serviceName}</h3>
            <p><strong>Customer:</strong> {b.customerName}</p>
            <p><strong>Technician:</strong> {b.technician}</p>
            <p><strong>Price:</strong> ${b.price || '0'}</p>
            <p><strong>Status:</strong> {b.status?.toUpperCase() || 'PENDING'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserAppointments;