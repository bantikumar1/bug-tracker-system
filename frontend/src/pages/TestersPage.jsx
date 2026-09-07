import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  TestTube, UserPlus, Mail, Lock, User, 
  AlertCircle, CheckCircle2, X, Eye, UserCheck, UserX 
} from 'lucide-react';

const TestersPage = () => {
  const [testers, setTesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tester');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchTesters();
  }, []);

  const fetchTesters = async () => {
    try {
      const response = await api.get('/users?role=tester');
      setTesters(response.data);
    } catch (err) {
      console.error('Failed to fetch testers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('All fields are required.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/users', { name, email, password, role });
      setFormSuccess(`Tester account for ${name} created successfully!`);
      setName('');
      setEmail('');
      setPassword('');
      setRole('tester');
      fetchTesters();
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
      }, 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create user account.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userObj) => {
    const newStatus = userObj.status === 'active' ? 'inactive' : 'active';
    setTogglingId(userObj.id);

    try {
      await api.put(`/users/${userObj.id}/status`, { status: newStatus });
      setTesters((prev) => 
        prev.map((u) => u.id === userObj.id ? { ...u, status: newStatus } : u)
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Testers list...</p>
      </div>
    );
  }

  return (
    <div className="users-page container" style={{ maxWidth: '1000px' }}>
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.5rem', fontWeight: '800' }}>
            <TestTube className="role-icon tester" size={24} />
            <span>Testers Management</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            View and manage system Quality Assurance (Tester) accounts
          </p>
        </div>

        <button 
          onClick={() => { setRole('tester'); setShowModal(true); }} 
          className="btn-primary" 
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
        >
          <UserPlus size={16} />
          <span>Create Tester</span>
        </button>
      </div>

      <div className="table-container">
        <table className="bug-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {testers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-table-cell">
                  No tester accounts found.
                </td>
              </tr>
            ) : (
              testers.map((t, idx) => (
                <tr key={t.id}>
                  <td className="cell-id">{idx + 1}</td>
                  <td className="user-name-cell">
                    <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: '600' }}>{t.name}</span>
                  </td>
                  <td>{t.email}</td>
                  <td>
                    <span 
                      className={`status-badge ${t.status === 'active' ? 'status-fixed' : 'status-open'}`} 
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', textTransform: 'capitalize' }}
                    >
                      {t.status || 'active'}
                    </span>
                  </td>
                  <td>{formatDate(t.created_at)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setSelectedUser(t)}
                        className="btn-view btn-table-action"
                        title="View Account Details"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleToggleStatus(t)}
                        disabled={togglingId === t.id}
                        className={`btn-table-action ${t.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                        style={{
                          background: t.status === 'active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: t.status === 'active' ? '#ef4444' : '#10b981',
                          border: `1px solid ${t.status === 'active' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                          padding: '0.35rem 0.6rem',
                          fontSize: '0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        {t.status === 'active' ? (
                          <>
                            <UserX size={13} />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={13} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Tester Account Details</h3>
              <button onClick={() => setSelectedUser(null)} className="btn-close">
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div className="meta-row">
                <span className="meta-label">Serial ID:</span>
                <span className="meta-value">#{selectedUser.id}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Full Name:</span>
                <span className="meta-value">{selectedUser.name}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Email Address:</span>
                <span className="meta-value">{selectedUser.email}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Status:</span>
                <span className={`status-badge ${selectedUser.status === 'active' ? 'status-fixed' : 'status-open'}`}>
                  {(selectedUser.status || 'active').toUpperCase()}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Role:</span>
                <span className="role-badge role-tester">TESTER</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Created At:</span>
                <span className="meta-value">{formatDate(selectedUser.created_at)}</span>
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button onClick={() => setSelectedUser(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tester Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Create User Account</h3>
              <button onClick={() => setShowModal(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert-error">
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="alert-success">
                <CheckCircle2 size={18} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="Set password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="tester">Tester</option>
                  <option value="developer">Developer</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestersPage;
