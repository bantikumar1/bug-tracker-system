import React from 'react';
import { Link } from 'react-router-dom';
import { User, AlertCircle, Clock, CheckCircle2, UserPlus, Eye } from 'lucide-react';

const BugCard = ({ bug, currentUser, onAssignToMe }) => {
  const isUnassigned = !bug.assigned_to;
  const isCanAssign = isUnassigned && currentUser.role === 'developer';

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
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
    switch (status) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN':
        return <AlertCircle size={14} />;
      case 'IN_PROGRESS':
        return <Clock size={14} />;
      case 'FIXED':
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="bug-card">
      <div className="bug-card-header">
        <h3 className="bug-card-title">{bug.title}</h3>
        <span className={`priority-badge ${getPriorityBadgeClass(bug.priority)}`}>
          {bug.priority}
        </span>
      </div>

      <div className="bug-card-body">
        <div className="bug-meta-item">
          <span className="meta-label">Status:</span>
          <span className={`status-badge ${getStatusBadgeClass(bug.status)}`}>
            {getStatusIcon(bug.status)}
            {bug.status.replace('_', ' ')}
          </span>
        </div>

        <div className="bug-meta-item">
          <span className="meta-label">Created By:</span>
          <span className="meta-value">
            <User size={14} className="icon-subtle" />
            {bug.creator_name || 'Unknown'}
          </span>
        </div>

        <div className="bug-meta-item">
          <span className="meta-label">Assigned To:</span>
          <span className={`meta-value ${isUnassigned ? 'unassigned-text' : ''}`}>
            <User size={14} className="icon-subtle" />
            {bug.assignee_name || 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="bug-card-actions">
        {isCanAssign ? (
          <button 
            className="btn-assign-me"
            onClick={() => onAssignToMe(bug.id)}
          >
            <UserPlus size={16} />
            <span>Assign to Me</span>
          </button>
        ) : (
          <Link to={`/bugs/${bug.id}`} className="btn-view">
            <Eye size={16} />
            <span>View</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default BugCard;
