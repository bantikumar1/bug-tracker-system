import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import BugTable from '../components/BugTable';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';

const BugList = () => {
  const { user } = useContext(AuthContext);
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await api.get('/bugs');
      setBugs(response.data);
    } catch (err) {
      console.error('Error fetching bugs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignToMe = async (bugId) => {
    try {
      await api.put(`/bugs/${bugId}/assign`);
      setMessage('Bug assigned to you successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchBugs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign bug.');
    }
  };

  const handleMarkAsFixed = async (bugId) => {
    try {
      await api.put(`/bugs/${bugId}/status`, { status: 'FIXED' });
      setMessage('Bug marked as FIXED successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchBugs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = (bug.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (bug.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || bug.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bug list...</p>
      </div>
    );
  }

  return (
    <div className="bug-list-page container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Bug List</h1>
          <p className="page-subtitle">View and manage software issues</p>
        </div>

        {user?.role === 'tester' && (
          <Link to="/bugs/create" className="btn-primary">
            <Plus size={18} />
            <span>Create Bug</span>
          </Link>
        )}
      </div>

      {message && (
        <div className="alert-success">
          <AlertCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search bugs by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} className="filter-icon" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="FIXED">FIXED</option>
          </select>
        </div>
      </div>

      <BugTable
        bugs={filteredBugs}
        currentUser={user}
        onAssignToMe={handleAssignToMe}
        onMarkAsFixed={handleMarkAsFixed}
      />
    </div>
  );
};

export default BugList;
