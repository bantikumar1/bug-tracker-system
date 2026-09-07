import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, ShieldCheck, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, loginUser, token } = useContext(AuthContext);
  const [twofaEnabled, setTwofaEnabled] = useState(user?.twofa_enabled || false);
  const [twofaMsg, setTwofaMsg] = useState({ type: '', text: '' });
  const [twofaLoading, setTwofaLoading] = useState(false);

  if (!user) return null;

  const handleToggle2FA = async (e) => {
    const newValue = e.target.checked;
    setTwofaEnabled(newValue);
    setTwofaLoading(true);
    setTwofaMsg({ type: '', text: '' });

    try {
      const res = await api.put('/users/2fa', { enabled: newValue });
      setTwofaMsg({ type: 'success', text: res.data?.message || '2FA settings updated successfully.' });
      if (loginUser && user && token) {
        loginUser({ ...user, twofa_enabled: newValue ? 1 : 0 }, token);
      }
    } catch (err) {
      setTwofaEnabled(!newValue);
      setTwofaMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update 2FA settings.' });
    } finally {
      setTwofaLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Your personal account details and security settings</p>
        </div>
      </div>

      <div className="details-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div className="user-avatar-circle" style={{ width: '64px', height: '64px', fontSize: '1.75rem' }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{user.name}</h2>
            <span className={`role-badge role-${user.role} style-pill`} style={{ marginTop: '0.4rem', display: 'inline-block' }}>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="meta-row">
            <span className="meta-label">
              <Mail size={16} className="icon-subtle" /> Email Address
            </span>
            <span className="meta-value">{user.email}</span>
          </div>

          <div className="meta-row">
            <span className="meta-label">
              <Shield size={16} className="icon-subtle" /> Assigned Role
            </span>
            <span className="meta-value">{user.role}</span>
          </div>

          <div className="meta-row">
            <span className="meta-label">
              <User size={16} className="icon-subtle" /> Account ID
            </span>
            <span className="meta-value">#{user.id}</span>
          </div>
        </div>

        {/* Two-Factor Authentication Toggle */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
            Two-Factor Authentication (OTP Login)
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Enhance account security by requiring a 6-digit OTP code sent to your email each time you log in.
          </p>

          {twofaMsg.text && (
            <div className={twofaMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1rem' }}>
              <AlertCircle size={16} />
              <span>{twofaMsg.text}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={twofaEnabled} 
                onChange={handleToggle2FA}
                disabled={twofaLoading}
                style={{ opacity: 0, width: 0, height: 0 }} 
              />
              <span style={{ 
                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                backgroundColor: twofaEnabled ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)', 
                transition: '.3s', borderRadius: '26px' 
              }}>
                <span style={{ 
                  position: 'absolute', content: '""', height: '20px', width: '20px', left: twofaEnabled ? '24px' : '3px', bottom: '3px', 
                  backgroundColor: 'white', transition: '.3s', borderRadius: '50%' 
                }}></span>
              </span>
            </label>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '600' }}>
                {twofaEnabled ? 'OTP 2FA is Currently ENABLED' : 'OTP 2FA is Currently DISABLED'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {twofaEnabled ? 'You will be prompted for a 6-digit OTP code on sign in.' : 'Single-step password login is active.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
