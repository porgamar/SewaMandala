import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
        userType,
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h1>Create account</h1>
        <p className="subtitle">Join as a client or talent</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="error">{error}</p>}

          <div className="user-type-selector">
            <span className="field-label">I am a</span>
            <div className="type-options">
              <label className={`type-card ${userType === 'client' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="client"
                  checked={userType === 'client'}
                  onChange={(event) => setUserType(event.target.value)}
                />
                <span className="type-icon" aria-hidden="true">
                  💼
                </span>
                <span className="type-label">Client</span>
                <span className="type-desc">Hire talent for projects</span>
              </label>

              <label className={`type-card ${userType === 'talent' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="talent"
                  checked={userType === 'talent'}
                  onChange={(event) => setUserType(event.target.value)}
                />
                <span className="type-icon" aria-hidden="true">
                  ⭐
                </span>
                <span className="type-label">Talent</span>
                <span className="type-desc">Offer your skills and services</span>
              </label>
            </div>
          </div>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
