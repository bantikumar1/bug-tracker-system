import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DeveloperDashboard from './DeveloperDashboard';
import TesterDashboard from './TesterDashboard';
import { 
  Bug, AlertCircle, Clock, CheckCircle2, 
  Users as UsersIcon, TestTube, Code, Eye, 
  ArrowRight, ShieldCheck 
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bugs, setBugs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [bugsRes, usersRes] = await Promise.all([
        api.get('/bugs'),
        api.get('/users')
      ]);
      setBugs(bugsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Role Redirection
  if (user?.role === 'developer') {
    return <DeveloperDashboard />;
  }

  if (user?.role === 'tester') {
    return <TesterDashboard />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  // Calculate Admin Metrics
  const totalBugs = bugs.length;
  const openBugs = bugs.filter((b) => b.status === 'OPEN').length;
  const inProgressBugs = bugs.filter((b) => b.status === 'IN_PROGRESS').length;
  const fixedBugs = bugs.filter((b) => b.status === 'FIXED').length;
  const totalTesters = users.filter((u) => u.role === 'tester').length;
  const totalDevelopers = users.filter((u) => u.role === 'developer').length;

  // Percentage calculations for status bar
  const openPct = totalBugs > 0 ? Math.round((openBugs / totalBugs) * 100) : 0;
  const inProgressPct = totalBugs > 0 ? Math.round((inProgressBugs / totalBugs) * 100) : 0;
  const fixedPct = totalBugs > 0 ? Math.round((fixedBugs / totalBugs) * 100) : 0;

  // Latest 5 bugs for Recent Bugs table
  const recentBugs = [...bugs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-progress';
      case 'FIXED': return 'status-fixed';
      default: return '';
    }
  };

  return (
    <div className="dashboard-page container" style={{ maxWidth: '1100px' }}>
      {/* 1. Header Section */}
      <div className="dashboard-header" style={{ marginBottom: '1.75rem', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.6rem', fontWeight: '800', tracking: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name || 'Admin'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
          <div className="user-avatar-circle" style={{ width: '36px', height: '36px', fontSize: '0.9rem' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {user?.name}
            </span>
            <span className="role-badge role-admin" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
              <ShieldCheck size={10} /> ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* 2. Summary Cards Grid */}
      <div className="metrics-grid" style={{ gap: '1rem', marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-icon-box total">
            <Bug size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{totalBugs}</span>
            <span className="metric-label">Total Bugs</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box open">
            <AlertCircle size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{openBugs}</span>
            <span className="metric-label">Open</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box progress">
            <Clock size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{inProgressBugs}</span>
            <span className="metric-label">In Progress</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box fixed">
            <CheckCircle2 size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{fixedBugs}</span>
            <span className="metric-label">Fixed</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box users">
            <TestTube size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{totalTesters}</span>
            <span className="metric-label">Testers</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box assigned">
            <Code size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value" style={{ fontSize: '1.6rem' }}>{totalDevelopers}</span>
            <span className="metric-label">Developers</span>
          </div>
        </div>
      </div>

      {/* 3. Bug Status Overview (Simple Visual Progress Bar) */}
      <div className="dashboard-section" style={{ marginBottom: '2rem', padding: '1.25rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Bug Status Overview</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{totalBugs} Total Issues</span>
        </div>

        {/* Minimal Stacked Progress Bar */}
        <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', display: 'flex', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ width: `${openPct}%`, background: '#ef4444', transition: 'width 0.3s' }} title={`Open: ${openBugs} (${openPct}%)`}></div>
          <div style={{ width: `${inProgressPct}%`, background: '#3b82f6', transition: 'width 0.3s' }} title={`In Progress: ${inProgressBugs} (${inProgressPct}%)`}></div>
          <div style={{ width: `${fixedPct}%`, background: '#10b981', transition: 'width 0.3s' }} title={`Fixed: ${fixedBugs} (${fixedPct}%)`}></div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
            <span>OPEN ({openBugs} - {openPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
            <span>IN_PROGRESS ({inProgressBugs} - {inProgressPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>FIXED ({fixedBugs} - {fixedPct}%)</span>
          </div>
        </div>
      </div>

      {/* 4. User Overview Section Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <TestTube className="role-icon tester" size={20} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Testers</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total registered QA Testers: {totalTesters}</p>
          </div>
          <Link to="/admin/testers" className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <span>View Testers</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Code className="role-icon developer" size={20} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Developers</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total registered Developers: {totalDevelopers}</p>
          </div>
          <Link to="/admin/developers" className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}>
            <span>View Developers</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* 5. Recent Bugs Overview Table */}
      <div className="dashboard-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Bugs</h2>
          <Link to="/bugs" className="btn-link" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>
            View All Bugs →
          </Link>
        </div>

        <div className="table-container">
          <table className="bug-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Bug</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBugs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No recent bugs found.
                  </td>
                </tr>
              ) : (
                recentBugs.map((bug, idx) => (
                  <tr key={bug.id}>
                    <td className="cell-id">{idx + 1}</td>
                    <td className="cell-title">
                      <span className="bug-title-text" title={bug.title}>{bug.title}</span>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
                        {bug.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(bug.status)}`}>
                        {bug.status}
                      </span>
                    </td>
                    <td>{bug.creator_name || 'N/A'}</td>
                    <td>{bug.assignee_name || 'Unassigned'}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/bugs/${bug.id}`)}
                        className="btn-view btn-table-action"
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
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

export default Dashboard;
