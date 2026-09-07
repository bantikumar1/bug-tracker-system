import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Bug, AlertCircle, Clock, CheckCircle2, 
  Eye, UserPlus, Code, ShieldCheck, Check 
} from 'lucide-react';

const DeveloperDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await api.get('/bugs');
      setBugs(response.data);
    } catch (err) {
      console.error('Failed to load developer dashboard bugs', err);
      setErrorMsg('Failed to load bugs from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (bugId) => {
    setActionLoadingId(bugId);
    setMessage('');
    setErrorMsg('');

    try {
      await api.put(`/bugs/${bugId}/assign`);
      setMessage('Bug assigned to you successfully!');
      setTimeout(() => setMessage(''), 3500);
      fetchBugs();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign bug.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkAsFixed = async (bugId) => {
    setActionLoadingId(bugId);
    setMessage('');
    setErrorMsg('');

    try {
      await api.put(`/bugs/${bugId}/status`, { status: 'FIXED' });
      setMessage('Bug marked as FIXED successfully!');
      setTimeout(() => setMessage(''), 3500);
      fetchBugs();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to mark bug as fixed.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-progress';
      case 'FIXED': return 'status-fixed';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Developer Dashboard...</p>
      </div>
    );
  }

  // Developer Specific Filtered Data
  const availableBugs = bugs.filter((b) => b.status === 'OPEN' && !b.assigned_to);
  const myAssignedBugs = bugs.filter((b) => b.assigned_to === user?.id && b.status === 'IN_PROGRESS');
  const fixedByMeBugs = bugs.filter((b) => b.assigned_to === user?.id && b.status === 'FIXED');

  return (
    <div className="dashboard-page container" style={{ maxWidth: '1050px' }}>
      {/* 1. Header Section */}
      <div className="dashboard-header" style={{ marginBottom: '1.75rem', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: '800' }}>
            Developer Dashboard
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name || 'Developer'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div className="user-avatar-circle" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {user?.name}
            </span>
            <span className="role-badge role-developer" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
              <Code size={10} /> DEVELOPER
            </span>
          </div>
        </div>
      </div>

      {/* Notifications / Feedback Alerts */}
      {message && (
        <div className="alert-success" style={{ marginBottom: '1.25rem' }}>
          <Check size={18} />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-error" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Summary Cards Grid */}
      <div className="metrics-grid" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Card 1: Available Bugs */}
        <div className="metric-card">
          <div className="metric-icon-box open">
            <AlertCircle size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.75rem' }}>{availableBugs.length}</span>
            <span className="metric-label">Available Bugs</span>
          </div>
        </div>

        {/* Card 2: My Assigned Bugs */}
        <div className="metric-card">
          <div className="metric-icon-box progress">
            <Clock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.75rem' }}>{myAssignedBugs.length}</span>
            <span className="metric-label">My Assigned Bugs</span>
          </div>
        </div>

        {/* Card 3: Fixed by Me */}
        <div className="metric-card">
          <div className="metric-icon-box fixed">
            <CheckCircle2 size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.75rem' }}>{fixedByMeBugs.length}</span>
            <span className="metric-label">Fixed by Me</span>
          </div>
        </div>
      </div>

      {/* 3. Available Bugs Section */}
      <div className="dashboard-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Available Bugs</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OPEN bugs available for developer assignment</p>
          </div>
          <span className="status-badge status-open" style={{ fontSize: '0.75rem' }}>
            {availableBugs.length} Available
          </span>
        </div>

        <div className="table-container">
          <table className="bug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bug Title</th>
                <th>Priority</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {availableBugs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                      <Bug size={32} className="icon-empty" />
                      <p style={{ fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>No available unassigned bugs</p>
                      <p style={{ fontSize: '0.8rem' }}>All reported issues are currently assigned or resolved.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                availableBugs.map((bug, idx) => (
                  <tr key={bug.id}>
                    <td className="cell-id">{idx + 1}</td>
                    <td className="cell-title">
                      <Link to={`/bugs/${bug.id}`} className="row-title-link" title={bug.title}>
                        {bug.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>{bug.creator_name || 'Tester'}</td>
                    <td>{formatDate(bug.created_at)}</td>
                    <td>
                      <div className="action-cell-group">
                        <Link to={`/bugs/${bug.id}`} className="btn-view btn-table-action">
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleAssignToMe(bug.id)}
                          disabled={actionLoadingId === bug.id}
                          className="btn-assign-me btn-table-action"
                        >
                          <UserPlus size={14} />
                          <span>{actionLoadingId === bug.id ? 'Assigning...' : 'Assign to Me'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. My Assigned Bugs Section */}
      <div className="dashboard-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>My Assigned Bugs</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bugs currently assigned to you and IN_PROGRESS</p>
          </div>
          <span className="status-badge status-progress" style={{ fontSize: '0.75rem' }}>
            {myAssignedBugs.length} Active
          </span>
        </div>

        <div className="table-container">
          <table className="bug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bug Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myAssignedBugs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                      <Clock size={32} className="icon-empty" />
                      <p style={{ fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>No bugs assigned to you</p>
                      <p style={{ fontSize: '0.8rem' }}>Assign available bugs above to start fixing them.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                myAssignedBugs.map((bug, idx) => (
                  <tr key={bug.id}>
                    <td className="cell-id">{idx + 1}</td>
                    <td className="cell-title">
                      <Link to={`/bugs/${bug.id}`} className="row-title-link" title={bug.title}>
                        {bug.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(bug.status)}`}>
                        IN PROGRESS
                      </span>
                    </td>
                    <td>{bug.creator_name || 'Tester'}</td>
                    <td>
                      <div className="action-cell-group">
                        <Link to={`/bugs/${bug.id}`} className="btn-view btn-table-action">
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleMarkAsFixed(bug.id)}
                          disabled={actionLoadingId === bug.id}
                          className="btn-fix btn-table-action"
                        >
                          <CheckCircle2 size={14} />
                          <span>{actionLoadingId === bug.id ? 'Updating...' : 'Mark as Fixed'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Recently Fixed Section */}
      <div className="dashboard-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recently Fixed</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>History of bugs previously resolved by you</p>
          </div>
          <span className="status-badge status-fixed" style={{ fontSize: '0.75rem' }}>
            {fixedByMeBugs.length} Fixed
          </span>
        </div>

        <div className="table-container">
          <table className="bug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bug Title</th>
                <th>Priority</th>
                <th>Fixed At</th>
              </tr>
            </thead>
            <tbody>
              {fixedByMeBugs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-table-cell">
                    <div className="empty-state" style={{ padding: '1.5rem 1rem' }}>
                      <CheckCircle2 size={32} className="icon-empty" />
                      <p style={{ fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>No fixed bugs recorded yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                fixedByMeBugs.map((bug, idx) => (
                  <tr key={bug.id}>
                    <td className="cell-id">{idx + 1}</td>
                    <td className="cell-title">
                      <Link to={`/bugs/${bug.id}`} className="row-title-link" title={bug.title}>
                        {bug.title}
                      </Link>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>{formatDate(bug.updated_at || bug.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
