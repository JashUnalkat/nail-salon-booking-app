import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { serviceCategories } from '../../data/services'; 
import './BookingForm.scss';

function BookingForm() {
  const navigate = useNavigate();
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    email: '',
    serviceName: '',
    price: 0, // Field to store extracted price
    technician: ''
  });

  // Helper function to extract price from string: "Service Name ($XX)"
  const extractPrice = (serviceString) => {
    const match = serviceString.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(
          usersRef, 
          where("role", "==", "nail_technician"),
          where("isTechnician", "==", true)
        );
        
        const querySnapshot = await getDocs(q);
        const techList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || "Technician",
        }));
        setTechnicians(techList);
      } catch (error) { console.error("Error fetching technicians:", error); }
    };
    fetchTechs();
  }, []);

  const handleServiceChange = (e) => {
    const selectedService = e.target.value;
    const price = extractPrice(selectedService);
    setFormData({ ...formData, serviceName: selectedService, price: price });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        status: 'pending',
        createdAt: new Date()
      });
      
      alert("Booking successfully submitted!");
      navigate('/my-appointments'); 
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to submit booking. Check console for details.");
    }
  };

  return (
    <div className="booking-page">
      <div className="form-container">
        <h1>Book Your Appointment</h1>
        <p>Ontario Centre Nails & Spa | St. Thomas, Ontario</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" required onChange={(e) => setFormData({...formData, customerName: e.target.value})} value={formData.customerName} />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input type="tel" required onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} value={formData.phoneNumber} />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} />
          </div>

          <div className="input-group">
            <label>Select Service</label>
            <select required onChange={handleServiceChange}>
              <option value="">-- Choose a Service --</option>
              {serviceCategories.map((group) => (
                <optgroup label={group.category} key={group.category}>
                  {group.services.map((service) => (
                    <option value={service} key={service}>{service}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Select Technician</label>
            <select required onChange={(e) => setFormData({...formData, technician: e.target.value})} value={formData.technician}>
              <option value="">-- Choose a Technician --</option>
              {technicians.map((tech) => (
                <option value={tech.name} key={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="confirm-btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;