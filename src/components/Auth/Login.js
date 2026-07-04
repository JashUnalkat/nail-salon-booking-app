import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';
import './AuthForm.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to Home on success
    } catch (err) {
      setError("Failed to login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Ontario Centre Nails & Spa</h2>
        <h3>Welcome Back</h3>
        <p>Log in to manage your appointments.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" id="email" required placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)} value={email}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" id="password" required placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} value={password}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="auth-helpers">
          <Link to="/forgot-password">Forgot Password?</Link>
          <div className="auth-helper-row">
            <span>New customer? </span>
            <Link to="/signup">Sign Up Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;