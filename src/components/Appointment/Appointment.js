import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, doc, query, where, writeBatch } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [allTechs, setAllTechs] = useState([]);
  const { user, role } = useAuth();

  // Load data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apptRef = collection(db, "appointments");
        const techRef = collection(db, "users");
        
        // Fetch appointments based on role
        let q = role === 'admin' ? apptRef : query(apptRef, where("technician", "==", user.displayName));
        
        // Fetch all technicians for the dropdown
        const [apptSnap, techSnap] = await Promise.all([
          getDocs(q), 
          getDocs(query(techRef, where("role", "==", "nail_technician")))
        ]);
        
        setAppointments(apptSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setAllTechs(techSnap.docs.map(d => d.data().name));
      } catch (error) { console.error("Error loading data:", error); }
    };
    if (role) fetchData();
  }, [role, user]);

  // Update local state when dropdown changes
  const handleLocalChange = (id, field, value) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  // BULK UPDATE: Saves current table state to Firestore
  const handleUpdateAll = async () => {
    const batch = writeBatch(db);
    appointments.forEach(appt => {
      batch.update(doc(db, "appointments", appt.id), { 
        status: appt.status, 
        technician: appt.technician 
      });
    });
    await batch.commit();
    alert("All changes saved to database!");
  };

  // BULK DELETE: Deletes all currently loaded appointments
  const handleClearAll = async () => {
    if (!window.confirm("WARNING: This will delete ALL appointments in this list from the database!")) return;
    
    const batch = writeBatch(db);
    appointments.forEach(appt => batch.delete(doc(db, "appointments", appt.id)));
    await batch.commit();
    setAppointments([]);
    alert("All appointments cleared!");
  };

  return (
    <div className="appointment-manager">
      <h1>Appointment Management</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleUpdateAll} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px' }}>Update All</button>
        <button onClick={handleClearAll} style={{ backgroundColor: 'red', color: 'white' }}>Clear All</button>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Technician</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appt => (
            <tr key={appt.id}>
              <td>{appt.customerName}</td>
              <td>{appt.serviceName}</td>
              <td>
                <select value={appt.technician} onChange={(e) => handleLocalChange(appt.id, 'technician', e.target.value)}>
                  {allTechs.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </td>
              <td>
                <select value={appt.status} onChange={(e) => handleLocalChange(appt.id, 'status', e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Appointment;