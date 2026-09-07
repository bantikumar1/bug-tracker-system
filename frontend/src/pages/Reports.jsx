import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart3, PieChart, TrendingUp, CheckCircle2, Clock, AlertCircle, Bug 
} from 'lucide-react';

const Reports = () => {
  const { user } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await api.get('/bugs');
      setBugs(response.data);
    } catch (err) {
      console.error('Failed to load reports data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics & reports...</p>
      </div>
    );
  }

  const total = bugs.length;
  const openCount = bugs.filter((b) => b.status === 'OPEN').length;
  const inProgressCount = bugs.filter((b) => b.status === 'IN_PROGRESS').length;
  const fixedCount = bugs.filter((b) => b.status === 'FIXED').length;

  const highPriority = bugs.filter((b) => b.priority === 'HIGH').length;
  const medPriority = bugs.filter((b) => b.priority === 'MEDIUM').length;
  const lowPriority = bugs.filter((b) => b.priority === 'LOW').length;

  const resolutionRate = total > 0 ? Math.round((fixedCount / total) * 100) : 0;

  return (
    <div className="container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Real-time system issue distribution and resolution metrics</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box total">
            <Bug size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{total}</span>
            <span className="metric-label">Total Reported Bugs</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box fixed">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{resolutionRate}%</span>
            <span className="metric-label">Resolution Rate</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box open">
            <AlertCircle size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{openCount}</span>
            <span className="metric-label">Open Issues</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box progress">
            <Clock size={24} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{inProgressCount}</span>
            <span className="metric-label">In Progress</span>
          </div>
        </div>
      </div>

      {/* Distribution Breakdown Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Status Distribution */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <PieChart size={20} className="icon-subtle" />
              <span>Status Breakdown</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>OPEN</span>
                <span style={{ fontWeight: '700' }}>{openCount} ({total > 0 ? Math.round((openCount / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (openCount / total) * 100 : 0}%`, height: '100%', background: '#3b82f6' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>IN PROGRESS</span>
                <span style={{ fontWeight: '700' }}>{inProgressCount} ({total > 0 ? Math.round((inProgressCount / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (inProgressCount / total) * 100 : 0}%`, height: '100%', background: '#8b5cf6' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>RESOLVED / FIXED</span>
                <span style={{ fontWeight: '700' }}>{fixedCount} ({total > 0 ? Math.round((fixedCount / total) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (fixedCount / total) * 100 : 0}%`, height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
              <BarChart3 size={20} className="icon-subtle" />
              <span>Priority Severity Breakdown</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>HIGH Priority</span>
                <span style={{ fontWeight: '700', color: '#ef4444' }}>{highPriority}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (highPriority / total) * 100 : 0}%`, height: '100%', background: '#ef4444' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>MEDIUM Priority</span>
                <span style={{ fontWeight: '700', color: '#f59e0b' }}>{medPriority}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (medPriority / total) * 100 : 0}%`, height: '100%', background: '#f59e0b' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>LOW Priority</span>
                <span style={{ fontWeight: '700', color: '#10b981' }}>{lowPriority}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${total > 0 ? (lowPriority / total) * 100 : 0}%`, height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
