import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const handleLocalChange = (userId, field, value) => {
    // Explicitly handle boolean conversion for isTechnician
    let formattedValue = value;
    if (field === 'isTechnician') {
      formattedValue = (value === 'true' || value === true);
    }
    setUsers(users.map(u => u.id === userId ? { ...u, [field]: formattedValue } : u));
  };

  const handleBulkUpdate = async () => {
    try {
      const updatePromises = users.map(user => {
        const userRef = doc(db, "users", user.id);
        return updateDoc(userRef, {
          email: user.email,
          name: user.name,
          role: user.role, // Must be 'nail_technician', 'admin', or 'customer'
          isTechnician: Boolean(user.isTechnician)
        });
      });
      await Promise.all(updatePromises);
      alert("All users updated successfully!");
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update. Check Console (F12) for permission errors.");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Delete this user?")) {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="admin-container">
      <h1>Staff Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Technician Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><input value={user.email || ""} onChange={(e) => handleLocalChange(user.id, "email", e.target.value)} /></td>
              <td><input value={user.name || ""} onChange={(e) => handleLocalChange(user.id, "name", e.target.value)} /></td>
              <td>
                <select value={user.role} onChange={(e) => handleLocalChange(user.id, "role", e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="nail_technician">Nail Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <select value={user.isTechnician ? "true" : "false"} onChange={(e) => handleLocalChange(user.id, "isTechnician", e.target.value)}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)} style={{backgroundColor: 'red', color: 'white'}}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBulkUpdate} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: 'blue', color: 'white' }}>
        Update All Staff
      </button>
    </div>
  );
}

export default AdminDashboard;