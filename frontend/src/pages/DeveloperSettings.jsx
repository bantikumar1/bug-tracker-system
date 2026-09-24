import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { BACKEND_URL } from '../services/api';
import { 
  User, Mail, Camera, Lock, Key, Save, Edit3, AlertCircle, Code, 
  ShieldCheck, Smartphone, LogOut
} from 'lucide-react';

const DeveloperSettings = () => {
  const { user, loginUser, logoutUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo ? `${BACKEND_URL}${user.profile_photo}` : null);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // 2. Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Session Management
  const [activeSessions, setActiveSessions] = useState([]);
  const [sessionMsg, setSessionMsg] = useState({ type: '', text: '' });

  // 2FA state
  const [twofaEnabled, setTwofaEnabled] = useState(user?.twofa_enabled || false);
  const [twofaMsg, setTwofaMsg] = useState({ type: '', text: '' });
  const [twofaLoading, setTwofaLoading] = useState(false);

  useEffect(() => {
    fetchDeveloperSettings();
  }, []);

  const fetchDeveloperSettings = async () => {
    try {
      const response = await api.get('/users/developer/settings');
      const { user: userData, activeSessions: sessions } = response.data;
      
      setName(userData.name || '');
      setEmail(userData.email || '');
      setTwofaEnabled(!!userData.twofa_enabled);
      if (userData.profile_photo) {
        setPhotoPreview(`${BACKEND_URL}${userData.profile_photo}`);
      }
      setActiveSessions(sessions || []);
    } catch (err) {
      console.error('Fetch developer settings error:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // 1. Profile Update Handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setProfileMsg({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    setProfileSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      if (profilePhotoFile) {
        formData.append('profile_photo', profilePhotoFile);
      }

      const response = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = response.data.user;
      loginUser({ ...user, ...updatedUser }, token);

      if (updatedUser.profile_photo) {
        setPhotoPreview(`${BACKEND_URL}${updatedUser.profile_photo}`);
      }

      setProfileMsg({ type: 'success', text: 'Profile information updated successfully!' });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  // 2. Change Password Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'All password fields are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and Confirm password do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setPasswordSubmitting(true);

    try {
      await api.put('/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });

      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Logout from All Devices Handler
  const handleLogoutAll = async () => {
    if (!window.confirm('Are you sure you want to log out from all active sessions and devices?')) {
      return;
    }

    try {
      await api.post('/users/developer/logout-all');
      setSessionMsg({ type: 'success', text: 'Logged out from all devices. Redirecting...' });
      setTimeout(() => {
        logoutUser();
        navigate('/login');
      }, 1500);
    } catch (err) {
      setSessionMsg({ type: 'error', text: 'Failed to log out all sessions.' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Developer Settings...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: '800' }}>Developer Settings</h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Manage profile, security, and session management
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Settings Navigation */}
        <div className="settings-nav-sidebar">
          <nav>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={18} />
                <span>Profile & Security</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`settings-nav-btn ${activeTab === 'sessions' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} />
                <span>Session Management</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Settings Panels */}
        <div className="settings-content-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* PROFILE & CHANGE PASSWORD */}
          {(activeTab === 'profile' || activeTab === 'all') && (
            <>
              {/* Profile Information */}
              <div className="form-card">
                <div className="form-header" style={{ marginBottom: '1.25rem', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Profile Information</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage your personal developer account details</p>
                  </div>
                  <button 
                    type="button" 
                    className={isEditingProfile ? "btn-secondary" : "btn-primary"}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    style={{ width: 'auto', padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}
                  >
                    <Edit3 size={15} /> <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                  </button>
                </div>

                {profileMsg.text && (
                  <div className={profileMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={18} /> <span>{profileMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="bug-form">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="Avatar" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                      ) : (
                        <div className="user-avatar-circle" style={{ width: '70px', height: '70px', fontSize: '1.8rem' }}>
                          {name ? name.charAt(0).toUpperCase() : 'D'}
                        </div>
                      )}
                      {isEditingProfile && (
                        <label htmlFor="devPhotoFile" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--accent-primary)', padding: '0.35rem', borderRadius: '50%', cursor: 'pointer', color: '#fff', display: 'flex' }}>
                          <Camera size={14} />
                          <input id="devPhotoFile" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{name || 'Developer'}</h4>
                      <span className="role-badge role-developer style-pill">
                        <Code size={13} /> DEVELOPER
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Full Name *</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input type="text" required disabled={!isEditingProfile} value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input type="email" required disabled={!isEditingProfile} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="form-actions" style={{ marginTop: '1rem' }}>
                      <button type="submit" className="btn-primary" disabled={profileSubmitting}>
                        <Save size={16} /> <span>{profileSubmitting ? 'Saving...' : 'Save Profile'}</span>
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Change Password */}
              <div className="form-card">
                <div className="form-header" style={{ marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Change Password</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Update account password securely</p>
                  </div>
                </div>

                {passwordMsg.text && (
                  <div className={passwordMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={18} /> <span>{passwordMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="bug-form">
                  <div className="form-group">
                    <label>Current Password *</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password *</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password (min 6 characters)" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password *</label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={18} />
                      <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                    </div>
                  </div>

                  <div className="form-actions" style={{ marginTop: '1rem' }}>
                    <button type="submit" className="btn-primary" disabled={passwordSubmitting} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                      <Key size={16} /> <span>{passwordSubmitting ? 'Updating...' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Two-Factor Authentication (OTP Login) */}
              <div className="form-card" style={{ marginTop: '1.5rem' }}>
                <div className="form-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
                      Two-Factor Authentication (OTP Login)
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Enhance account security by requiring a 6-digit OTP verification code sent to your email each time you log in.
                    </p>
                  </div>
                </div>

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
            </>
          )}

          {/* SESSION MANAGEMENT */}
          {(activeTab === 'sessions' || activeTab === 'all') && (
            <div className="form-card">
              <div className="form-header" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Session Management</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View active sessions and log out from all devices</p>
                </div>
              </div>

              {sessionMsg.text && (
                <div className={sessionMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={18} /> <span>{sessionMsg.text}</span>
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                {activeSessions.map((s) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Smartphone size={20} style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <span style={{ fontSize: '0.88rem', fontWeight: '600', display: 'block' }}>{s.device}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IP: {s.ip} • {s.lastActive}</span>
                      </div>
                    </div>
                    <span className="status-badge status-fixed" style={{ fontSize: '0.7rem' }}>Active</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleLogoutAll}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', width: 'auto' }}
              >
                <LogOut size={16} /> <span>Logout from all devices</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
