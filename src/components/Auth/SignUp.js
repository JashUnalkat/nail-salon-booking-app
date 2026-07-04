import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import './AuthForm.scss'; // Reuse your existing styling

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Create User Document in Firestore with default 'customer' role
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        role: "customer", // All new signups are customers by default
        createdAt: new Date()
      });

      navigate('/'); // Redirect to Home
    } catch (err) {
      setError("Failed to create account: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join Ontario Centre Nails & Spa</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" id="email" required
              onChange={(e) => setEmail(e.target.value)} value={email}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" id="password" required
              onChange={(e) => setPassword(e.target.value)} value={password}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-helpers">
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;