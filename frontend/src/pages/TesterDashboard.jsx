import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import BugTable from '../components/BugTable';
import { 
  FileText, AlertCircle, Clock, CheckCircle2, XCircle, Plus 
} from 'lucide-react';

const TesterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await api.get('/bugs');
      setBugs(response.data);
    } catch (err) {
      console.error('Failed to load tester dashboard bugs', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Tester Dashboard...</p>
      </div>
    );
  }

  // Tester Specific Metrics
  const reportedBugs = bugs.filter((b) => b.created_by === user?.id).length;
  const openBugs = bugs.filter((b) => b.status === 'OPEN' && b.created_by === user?.id).length;
  const inProgressBugs = bugs.filter((b) => b.status === 'IN_PROGRESS' && b.created_by === user?.id).length;
  const resolvedBugs = bugs.filter((b) => b.status === 'FIXED' && b.created_by === user?.id).length;
  const rejectedBugs = 0;

  const filteredBugs = statusFilter === 'ALL'
    ? bugs
    : statusFilter === 'MY_REPORTED'
    ? bugs.filter((b) => b.created_by === user?.id)
    : bugs.filter((b) => b.status === statusFilter && b.created_by === user?.id);

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Tester Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Report defects and monitor resolution status.</p>
        </div>

        <Link to="/bugs/create" className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
          <Plus size={18} />
          <span>Report New Bug</span>
        </Link>
      </div>

      {/* Tester Metric Cards */}
      <div className="metrics-grid">
        <div 
          className={`metric-card ${statusFilter === 'MY_REPORTED' ? 'active-filter' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'MY_REPORTED' ? 'ALL' : 'MY_REPORTED')}
        >
          <div className="metric-icon-box total" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <FileText size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{reportedBugs}</span>
            <span className="metric-label">Reported Bugs</span>
          </div>
        </div>

        <div 
          className={`metric-card ${statusFilter === 'OPEN' ? 'active-filter' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'OPEN' ? 'ALL' : 'OPEN')}
        >
          <div className="metric-icon-box open">
            <AlertCircle size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{openBugs}</span>
            <span className="metric-label">Open Bugs</span>
          </div>
        </div>

        <div 
          className={`metric-card ${statusFilter === 'IN_PROGRESS' ? 'active-filter' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
        >
          <div className="metric-icon-box progress">
            <Clock size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{inProgressBugs}</span>
            <span className="metric-label">In Progress</span>
          </div>
        </div>

        <div 
          className={`metric-card ${statusFilter === 'FIXED' ? 'active-filter' : ''}`}
          onClick={() => setStatusFilter(statusFilter === 'FIXED' ? 'ALL' : 'FIXED')}
        >
          <div className="metric-icon-box fixed">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{resolvedBugs}</span>
            <span className="metric-label">Resolved</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box users" style={{ background: 'rgba(100, 116, 139, 0.15)', color: '#64748b' }}>
            <XCircle size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{rejectedBugs}</span>
            <span className="metric-label">Rejected Bugs</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section" style={{ background: 'transparent', border: 'none', padding: 0 }}>
        <div className="section-header">
          <h2>Bug List {statusFilter !== 'ALL' && `(${statusFilter.replace('_', ' ')})`}</h2>
          {statusFilter !== 'ALL' && (
            <button className="btn-link-clear" onClick={() => setStatusFilter('ALL')}>
              Show All
            </button>
          )}
        </div>

        <BugTable bugs={filteredBugs} currentUser={user} />
      </div>
    </div>
  );
};

export default TesterDashboard;
