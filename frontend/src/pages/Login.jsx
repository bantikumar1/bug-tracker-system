import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bug, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <main className="auth-page">
      <section className="auth-showcase" aria-label="BugTracker introduction">
        <Link to="/" className="auth-brand"><span className="auth-brand-mark"><Bug size={19} /></span> BugTracker</Link>
        <div className="auth-showcase-copy">
          <p className="auth-eyebrow">BUG MANAGEMENT, SIMPLIFIED</p>
          <h1>Turn every bug into a better release.</h1>
          <p>One calm workspace for reporting, assigning, and resolving issues together.</p>
        </div>
        <div className="auth-benefits">
          {['Clear ownership for every issue', 'Real-time team collaboration', 'Secure, role-based access'].map((benefit) => <div key={benefit}><Check size={16} />{benefit}</div>)}
        </div>
        <p className="auth-showcase-note">Built for focused product teams.</p>
      </section>

      <section className="auth-form-panel">
        <Link to="/" className="auth-mobile-brand"><span className="auth-brand-mark"><Bug size={18} /></span> BugTracker</Link>
        <div className="login-card auth-card">
        <div className="login-header">
          <div className="login-icon-box">
            {requiresOtp ? <ShieldCheck size={36} /> : <Bug size={36} />}
          </div>
          <p className="auth-eyebrow">{requiresOtp ? 'SECURITY CHECK' : 'WELCOME BACK'}</p>
          <h2>{requiresOtp ? 'Confirm it’s you' : 'Sign in to BugTracker'}</h2>
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login-submit" disabled={loading}>
              {loading ? 'Signing in...' : <><span>Sign in securely</span><ArrowRight size={18} /></>}
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

        {!requiresOtp && <div className="login-footer">
          <p>New here? <Link to="/signup">Create your account</Link></p>
          <p className="auth-footer-note">Choose Developer or Tester during signup.</p>
        </div>}
        </div>
      </section>
    </main>
  );
};

export default Login;
