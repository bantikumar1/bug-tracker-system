import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bug, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // If 2FA OTP is required for this account
      if (response.data?.requiresOtp) {
        setRequiresOtp(true);
        setTempToken(response.data.tempToken);
        setInfoMessage(response.data.message || 'A 6-digit verification code has been sent to your email.');
        return;
      }

      // Normal 1-step login
      const { user, token } = response.data;
      loginUser(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-login-otp', {
        tempToken,
        otp: otp.trim()
      });

      const { user, token } = response.data;
      loginUser(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            {requiresOtp ? <ShieldCheck size={36} /> : <Bug size={36} />}
          </div>
          <h2>{requiresOtp ? '2FA Verification' : 'Bug Tracker'}</h2>
          <p>
            {requiresOtp 
              ? 'Enter the 6-digit OTP code sent to your registered email' 
              : 'Sign in to access your issue management workspace'}
          </p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="alert-success">
            <CheckCircle2 size={18} />
            <span>{infoMessage}</span>
          </div>
        )}

        {!requiresOtp ? (
          <form onSubmit={handlePasswordLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="otp">6-Digit OTP Verification Code</label>
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
              {loading ? 'Verifying OTP...' : 'Verify & Continue'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
              <button
                type="button"
                onClick={() => { setRequiresOtp(false); setError(''); setInfoMessage(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="login-footer">
          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p>New Developer? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Register as Developer</Link></p>
            <p>New Tester? <Link to="/tester/register" style={{ color: '#10b981', fontWeight: '600', textDecoration: 'none' }}>Register as Tester</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
