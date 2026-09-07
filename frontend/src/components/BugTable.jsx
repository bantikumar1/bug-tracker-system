import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Eye, UserPlus, CheckCircle2, Search, Filter, RotateCcw, 
  ChevronLeft, ChevronRight, ArrowUpDown, Bug, AlertCircle 
} from 'lucide-react';

const BugTable = ({ 
  bugs = [], 
  currentUser, 
  onAssignToMe, 
  onMarkAsFixed,
  loading = false,
  error = null 
}) => {
  const [searchParams] = useSearchParams();

  // URL query params initialization (e.g. ?filter=assigned, ?filter=reported, ?search=...)
  const initialSearch = searchParams.get('search') || '';
  const initialFilter = searchParams.get('filter');

  const [search, setSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [developerFilter, setDeveloperFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('id-desc'); // id-desc, id-asc, title, priority, date

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Extract unique assigned developers list for filter dropdown
  const developersList = useMemo(() => {
    const devsMap = new Map();
    bugs.forEach((b) => {
      if (b.assigned_to && b.assignee_name) {
        devsMap.set(b.assigned_to, b.assignee_name);
      }
    });
    return Array.from(devsMap.entries()).map(([id, name]) => ({ id, name }));
  }, [bugs]);

  // Handle URL preset filters (?filter=assigned or ?filter=reported)
  const effectiveBugs = useMemo(() => {
    if (initialFilter === 'assigned' && currentUser?.id) {
      return bugs.filter((b) => b.assigned_to === currentUser.id);
    }
    if (initialFilter === 'reported' && currentUser?.id) {
      return bugs.filter((b) => b.created_by === currentUser.id);
    }
    return bugs;
  }, [bugs, initialFilter, currentUser]);

  // Filter & Sort Logic
  const processedBugs = useMemo(() => {
    return effectiveBugs.filter((bug) => {
      // Search
      const matchesSearch = 
        !search ||
        (bug.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (bug.description || '').toLowerCase().includes(search.toLowerCase());

      // Status
      const matchesStatus = statusFilter === 'ALL' || bug.status === statusFilter;

      // Priority
      const matchesPriority = priorityFilter === 'ALL' || bug.priority === priorityFilter;

      // Developer
      let matchesDeveloper = true;
      if (developerFilter === 'UNASSIGNED') {
        matchesDeveloper = !bug.assigned_to;
      } else if (developerFilter !== 'ALL') {
        matchesDeveloper = String(bug.assigned_to) === String(developerFilter);
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesDeveloper;
    }).sort((a, b) => {
      if (sortBy === 'id-desc') return b.id - a.id;
      if (sortBy === 'id-asc') return a.id - b.id;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'priority') {
        const pMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
      }
      if (sortBy === 'date') return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });
  }, [effectiveBugs, search, statusFilter, priorityFilter, developerFilter, sortBy]);

  // Reset pagination on filter change
  const totalItems = processedBugs.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedBugs = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return processedBugs.slice(start, start + pageSize);
  }, [processedBugs, activePage, pageSize]);

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setDeveloperFilter('ALL');
    setSortBy('id-desc');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'priority-high';
      case 'MEDIUM':
        return 'priority-medium';
      case 'LOW':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'status-open';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'FIXED':
        return 'status-fixed';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
        <p>Loading issue table...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-error" style={{ margin: '1.5rem 0' }}>
        <AlertCircle size={18} />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      {/* Filter Control Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-controls-group">
          {/* Status Filter */}
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-filter"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="FIXED">FIXED</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="filter-group">
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-filter"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Assigned Developer Filter */}
          <div className="filter-group">
            <select
              value={developerFilter}
              onChange={(e) => {
                setDeveloperFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select-filter"
            >
              <option value="ALL">All Developers</option>
              <option value="UNASSIGNED">Unassigned</option>
              {developersList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="filter-group">
            <ArrowUpDown size={16} className="filter-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-filter"
            >
              <option value="id-desc">Newest First</option>
              <option value="id-asc">Oldest First</option>
              <option value="priority">High Priority First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(search || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || developerFilter !== 'ALL') && (
            <button className="btn-clear-filters" onClick={clearAllFilters} title="Reset Filters">
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="table-container">
        <table className="bug-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Bug Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Reported By</th>
              <th>Assigned To</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBugs.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                    <Bug size={40} className="icon-empty" />
                    <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>No bugs found</p>
                    <p style={{ fontSize: '0.85rem' }}>Try adjusting your search query or clear active filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedBugs.map((bug, index) => {
                const serialNo = (activePage - 1) * pageSize + index + 1;
                const isUnassigned = !bug.assigned_to;
                const isDeveloper = currentUser?.role === 'developer';
                const isAssignedToMe = isDeveloper && bug.assigned_to === currentUser.id;
                
                const canAssignToMe = isDeveloper && bug.status === 'OPEN' && isUnassigned;
                const canMarkAsFixed = isAssignedToMe && bug.status !== 'FIXED';

                return (
                  <tr key={bug.id}>
                    {/* Pure numeric Serial No. (1, 2, 3...) - Absolutely NO # symbol */}
                    <td className="cell-id">{serialNo}</td>
                    
                    <td className="cell-title">
                      <Link 
                        to={`/bugs/${bug.id}`} 
                        className="row-title-link"
                        title={bug.title}
                      >
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
                        {bug.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td>{bug.creator_name || 'Unknown'}</td>

                    <td className={isUnassigned ? 'unassigned-text' : ''}>
                      {bug.assignee_name || 'Unassigned'}
                    </td>

                    <td>{formatDate(bug.created_at)}</td>

                    <td>
                      <div className="action-cell-group">
                        <Link to={`/bugs/${bug.id}`} className="btn-view btn-table-action">
                          <Eye size={14} />
                          <span>View</span>
                        </Link>

                        {canAssignToMe && onAssignToMe && (
                          <button
                            onClick={() => onAssignToMe(bug.id)}
                            className="btn-assign-me btn-table-action"
                          >
                            <UserPlus size={14} />
                            <span>Assign to Me</span>
                          </button>
                        )}

                        {canMarkAsFixed && onMarkAsFixed && (
                          <button
                            onClick={() => onMarkAsFixed(bug.id)}
                            className="btn-fix btn-table-action"
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark as Fixed</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing <span>{Math.min(totalItems, (activePage - 1) * pageSize + 1)}</span> to{' '}
            <span>{Math.min(totalItems, activePage * pageSize)}</span> of <span>{totalItems}</span> issues
          </div>

          <div className="pagination-controls">
            <div className="page-size-selector">
              <label htmlFor="pageSizeSelect">Rows:</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="page-nav-buttons">
              <button
                className="btn-pagination"
                disabled={activePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span className="page-indicator">
                Page {activePage} of {totalPages}
              </span>

              <button
                className="btn-pagination"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugTable;
