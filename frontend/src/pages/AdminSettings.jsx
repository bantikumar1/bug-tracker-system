import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, Mail, Shield, Camera, Lock, Key, Users as UsersIcon, 
  TestTube, Code, Save, Edit3, AlertCircle, CheckCircle2, ShieldCheck,
  ChevronRight, ArrowRight
} from 'lucide-react';

const AdminSettings = () => {
  const { user, loginUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Settings Tab state: 'profile' | 'security' | 'users'
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo ? `http://localhost:5000${user.profile_photo}` : null);
  
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // 2FA state
  const [twofaEnabled, setTwofaEnabled] = useState(user?.twofa_enabled || false);
  const [twofaMsg, setTwofaMsg] = useState({ type: '', text: '' });
  const [twofaLoading, setTwofaLoading] = useState(false);

  // Fetch latest profile on load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data;
      setName(data.name || '');
      setEmail(data.email || '');
      setTwofaEnabled(!!data.twofa_enabled);
      if (data.profile_photo) {
        setPhotoPreview(`http://localhost:5000${data.profile_photo}`);
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
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

  // Handle Profile Update
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
      
      loginUser(updatedUser, token);

      if (updatedUser.profile_photo) {
        setPhotoPreview(`http://localhost:5000${updatedUser.profile_photo}`);
      }

      setProfileMsg({ type: 'success', text: 'Admin profile updated successfully!' });
      setIsEditing(false);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Handle Change Password
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

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <div className="page-header-row" style={{ marginBottom: '1.75rem' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: '800' }}>Admin Settings</h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Manage profile information, account security, and user management categories
          </p>
        </div>
      </div>

      {/* Instagram-inspired Settings Container with Responsive Sidebar/Top Navigation */}
      <div className="settings-grid">
        {/* Left Settings Sidebar Navigation */}
        <div className="settings-nav-sidebar">
          <div style={{ padding: '0 1.25rem 0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Settings
            </h3>
          </div>

          <nav>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={18} />
                <span>Profile</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeTab === 'profile' ? 1 : 0.4 }} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Lock size={18} />
                <span>Password & Security</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeTab === 'security' ? 1 : 0.4 }} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`settings-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UsersIcon size={18} />
                <span>User Management</span>
              </div>
              <ChevronRight size={16} style={{ opacity: activeTab === 'users' ? 1 : 0.4 }} />
            </button>
          </nav>
        </div>

        {/* Right Settings Content Area */}
        <div className="settings-content-area">
          {/* TAB 1: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Profile</h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Update admin personal details and profile picture</p>
                </div>

                <button 
                  type="button"
                  className={isEditing ? "btn-secondary" : "btn-primary"}
                  onClick={() => setIsEditing(!isEditing)}
                  style={{ width: 'auto', padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                >
                  <Edit3 size={15} />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              {profileMsg.text && (
                <div className={profileMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="bug-form">
                {/* Profile Photo Display / Upload */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ position: 'relative' }}>
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Admin Avatar" 
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                      />
                    ) : (
                      <div className="user-avatar-circle" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                        {name ? name.charAt(0).toUpperCase() : 'A'}
                      </div>
                    )}

                    {isEditing && (
                      <label htmlFor="photoUpload" style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--accent-primary)', padding: '0.4rem', borderRadius: '50%', cursor: 'pointer', color: '#fff', display: 'flex', shadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                        <Camera size={14} />
                        <input 
                          id="photoUpload"
                          type="file" 
                          accept="image/*"
                          onChange={handlePhotoChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.2rem' }}>{name || 'Admin'}</h4>
                    <span className="role-badge role-admin style-pill">
                      <ShieldCheck size={13} /> ADMIN
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      System Administrator Account (Role is fixed as ADMIN)
                    </p>
                  </div>
                </div>

                {/* Name Input */}
                <div className="form-group">
                  <label htmlFor="adminName">Admin Name</label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      id="adminName"
                      type="text"
                      required
                      disabled={!isEditing}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter admin full name"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="adminEmail">Admin Email</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      id="adminEmail"
                      type="email"
                      required
                      disabled={!isEditing}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter admin email address"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                    <button type="submit" className="btn-primary" disabled={profileSubmitting}>
                      <Save size={16} />
                      <span>{profileSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Password & Security</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Update admin account security password and authentication</p>
              </div>

              {passwordMsg.text && (
                <div className={passwordMsg.type === 'error' ? 'alert-error' : 'alert-success'} style={{ marginBottom: '1.25rem' }}>
                  <AlertCircle size={18} />
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="bug-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="currentPassword"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password *</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={18} />
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn-primary" disabled={passwordSubmitting} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                    <Key size={16} />
                    <span>{passwordSubmitting ? 'Updating Password...' : 'Change Password'}</span>
                  </button>
                </div>
              </form>

              {/* Two-Factor Authentication (OTP Login) */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
                  Two-Factor Authentication (OTP Login)
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Enhance account security by requiring a 6-digit OTP verification code sent to your email each time you log in.
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
          )}

          {/* TAB 3: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>User Management</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Manage system account categories for Testers and Developers</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Testers Section Card */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <TestTube className="role-icon tester" size={24} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Testers</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Manage Quality Assurance (Tester) accounts, create new testers, view details, and toggle active status.
                    </p>
                  </div>
                  <Link to="/admin/testers" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <span>Manage Testers</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Developers Section Card */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                      <Code className="role-icon developer" size={24} />
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Developers</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Manage Software Engineer (Developer) accounts, create new developers, view details, and toggle active status.
                    </p>
                  </div>
                  <Link to="/admin/developers" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    <span>Manage Developers</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
