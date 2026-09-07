import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import BugTable from '../components/BugTable';
import { AlertCircle, CheckCircle2, ListTodo, UserCheck } from 'lucide-react';

const DeveloperBugsPage = ({ filterType }) => {
  const { user } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchBugs();
  }, [filterType]);

  const fetchBugs = async () => {
    setLoading(true);
    try {
      let endpoint = '/bugs';
      if (filterType === 'available') {
        endpoint = '/bugs?status=OPEN&assigned_to=unassigned';
      } else if (filterType === 'my-assigned') {
        endpoint = '/bugs?status=IN_PROGRESS&assigned_to=me';
      } else if (filterType === 'fixed') {
        endpoint = '/bugs?status=FIXED&assigned_to=me';
      }

      const response = await api.get(endpoint);
      setBugs(response.data);
    } catch (err) {
      console.error('Failed to fetch filtered bugs', err);
      setErrorMsg('Failed to fetch bugs from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (bugId) => {
    setMessage('');
    setErrorMsg('');
    try {
      await api.put(`/bugs/${bugId}/assign`);
      setMessage('Bug assigned to you successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchBugs();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to assign bug.');
    }
  };

  const handleMarkAsFixed = async (bugId) => {
    setMessage('');
    setErrorMsg('');
    try {
      await api.put(`/bugs/${bugId}/status`, { status: 'FIXED' });
      setMessage('Bug marked as FIXED successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchBugs();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const getPageDetails = () => {
    switch (filterType) {
      case 'available':
        return {
          title: 'Available Bugs',
          subtitle: 'OPEN bugs available for developer assignment',
          icon: ListTodo,
          badgeColor: 'status-open'
        };
      case 'my-assigned':
        return {
          title: 'My Assigned Bugs',
          subtitle: 'Bugs assigned to you currently IN_PROGRESS',
          icon: UserCheck,
          badgeColor: 'status-progress'
        };
      case 'fixed':
        return {
          title: 'Fixed by Me',
          subtitle: 'History of bugs resolved by you',
          icon: CheckCircle2,
          badgeColor: 'status-fixed'
        };
      default:
        return {
          title: 'Developer Bugs',
          subtitle: 'Manage and resolve reported issues',
          icon: ListTodo,
          badgeColor: 'status-open'
        };
    }
  };

  const details = getPageDetails();
  const Icon = details.icon;

  return (
    <div className="bug-list-page container" style={{ maxWidth: '1050px' }}>
      <div className="page-header-row" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.5rem', fontWeight: '800' }}>
            <Icon size={24} className="input-icon" />
            <span>{details.title}</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {details.subtitle}
          </p>
        </div>

        <span className={`status-badge ${details.badgeColor}`} style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }}>
          {bugs.length} Issues
        </span>
      </div>

      {message && (
        <div className="alert-success" style={{ marginBottom: '1.25rem' }}>
          <CheckCircle2 size={18} />
          <span>{message}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-error" style={{ marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <BugTable
        bugs={bugs}
        currentUser={user}
        onAssignToMe={filterType === 'available' ? handleAssignToMe : undefined}
        onMarkAsFixed={filterType === 'my-assigned' ? handleMarkAsFixed : undefined}
        loading={loading}
      />
    </div>
  );
};

export default DeveloperBugsPage;
