import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Shield, Save } from 'lucide-react';

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure application workspace preferences</p>
        </div>
      </div>

      <div className="form-card" style={{ maxWidth: '640px' }}>
        {saved && (
          <div className="alert-success">
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bug-form">
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={18} className="icon-subtle" /> Desktop Notifications
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
              <input 
                type="checkbox" 
                checked={notifications} 
                onChange={(e) => setNotifications(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Receive real-time notifications for status changes and assignments</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} className="icon-subtle" /> Security Email Digest
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem' }}>
              <input 
                type="checkbox" 
                checked={emailAlerts} 
                onChange={(e) => setEmailAlerts(e.target.checked)} 
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Send daily email summary of open defect reports</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              <Save size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
