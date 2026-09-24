import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const VerifyResetOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-reset-otp', {
        email: email.trim(),
        otp: otp.trim()
      });

      setMessage(response.data?.message || 'OTP verified successfully!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.trim(), otp: otp.trim() } });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <ShieldCheck size={36} />
          </div>
          <h2>Verify OTP Code</h2>
          <p>Enter the 6-digit OTP code sent to your email address.</p>
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

        <form onSubmit={handleVerify} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="otp">6-Digit Verification OTP</label>
            <div className="input-wrapper">
              <ShieldCheck className="input-icon" size={18} />
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ letterSpacing: '6px', fontWeight: '700', fontSize: '1.2rem', textAlign: 'center' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Verifying OTP...' : 'Verify OTP & Continue'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <Link
            to="/forgot-password"
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
            <ArrowLeft size={15} /> Resend Code / Change Email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOTP;
