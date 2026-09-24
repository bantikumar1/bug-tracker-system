import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(location.state?.email || '');
  const [otp] = useState(location.state?.otp || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email: email.trim(),
        otp: otp.trim(),
        password,
        confirmPassword
      });

      setMessage(response.data?.message || 'Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <Lock size={36} />
          </div>
          <h2>Reset Password</h2>
          <p>Create a new strong password for your BugTracker account.</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="login-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="Enter at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Set New Password'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <Link
            to="/login"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: '500'
            }}
          >
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
