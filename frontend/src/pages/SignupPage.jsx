import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2, Shield, Bug, ArrowRight, Eye, EyeOff, Code2, TestTube2, Check } from 'lucide-react';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('developer'); // default to 'developer'

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Sign Up - BugTracker Self-Registration';
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword || !role) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (role !== 'developer' && role !== 'tester') {
      setError('Invalid role selection. Only Developer or Tester self-registration is allowed.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/signup', {
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        role
      });

      const message = response.data?.message || 'Account created successfully! Your account is currently pending Admin approval.';
      setSuccess(message);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Registration error:', err);
      const errMsg = err.response?.data?.message || 'An error occurred during registration. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-signup-page">
      <section className="auth-showcase" aria-label="BugTracker introduction">
        <Link to="/" className="auth-brand"><span className="auth-brand-mark"><Bug size={19} /></span> BugTracker</Link>
        <div className="auth-showcase-copy">
          <p className="auth-eyebrow">START COLLABORATING</p>
          <h1>A smoother path from report to resolution.</h1>
          <p>Bring your QA and engineering workflow into one shared, organized space.</p>
        </div>
        <div className="auth-benefits">
          {['Report issues with context', 'Keep every update visible', 'Work with the right access level'].map((benefit) => <div key={benefit}><Check size={16} />{benefit}</div>)}
        </div>
      </section>

      <section className="auth-form-panel">
        <Link to="/" className="auth-mobile-brand"><span className="auth-brand-mark"><Bug size={18} /></span> BugTracker</Link>
      <div className="login-card auth-card auth-signup-card">
        <div className="login-header">
          <div className="login-icon-box">
            <UserPlus size={36} />
          </div>
          <p className="auth-eyebrow">CREATE YOUR ACCOUNT</p>
          <h2>Join BugTracker</h2>
          <p>Create your account to start managing issues and collaborating with your team</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>How will you use BugTracker?</label>
            <div className="role-choice-grid" role="radiogroup" aria-label="Account role">
              <button type="button" className={`role-choice ${role === 'developer' ? 'active' : ''}`} onClick={() => setRole('developer')} aria-pressed={role === 'developer'}><Code2 size={18} /><span><strong>Developer</strong><small>Fix & manage issues</small></span></button>
              <button type="button" className={`role-choice tester ${role === 'tester' ? 'active' : ''}`} onClick={() => setRole('tester')} aria-pressed={role === 'tester'}><TestTube2 size={18} /><span><strong>Tester</strong><small>Report & verify bugs</small></span></button>
            </div>
            <span className="role-choice-note">
              <Shield size={12} /> Admin accounts are provisioned by system administrators.
            </span>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (min. 6 characters)"
                required
              />
              <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showConfirmation ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
              <button className="password-toggle" type="button" onClick={() => setShowConfirmation(!showConfirmation)} aria-label={showConfirmation ? 'Hide password' : 'Show password'}>{showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><span>Create account</span><ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      </section>
    </main>
  );
};

export default SignupPage;
