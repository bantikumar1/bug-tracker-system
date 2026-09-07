import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  ArrowLeft, Bug, User, Calendar, Clock, 
  AlertCircle, CheckCircle2, UserPlus, ShieldAlert, MessageSquare, Send, Paperclip
} from 'lucide-react';

const BugDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Comments / Activity state (persisted locally per bug)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchBugDetails();
    loadComments();
  }, [id]);

  const fetchBugDetails = async () => {
    try {
      const response = await api.get(`/bugs/${id}`);
      setBug(response.data);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load bug details.' });
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    try {
      const stored = localStorage.getItem(`bug_comments_${id}`);
      if (stored) {
        setComments(JSON.parse(stored));
      } else {
        // Initial activity items
        setComments([
          { id: 1, author: 'System', role: 'system', text: 'Bug issue reported and logged.', time: 'Initial' }
        ]);
      }
    } catch (e) {
      console.error('Error loading comments', e);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: Date.now(),
      author: user?.name || 'User',
      role: user?.role || 'user',
      text: newComment.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...comments, commentObj];
    setComments(updated);
    try {
      localStorage.setItem(`bug_comments_${id}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving comment', e);
    }
    setNewComment('');
  };

  const handleAssignToMe = async () => {
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.put(`/bugs/${id}/assign`);
      setBug(response.data.bug);
      
      // Add activity entry
      const activityObj = {
        id: Date.now(),
        author: user?.name || 'Developer',
        role: 'developer',
        text: `Assigned bug #${id} to self. Status set to IN_PROGRESS.`,
        time: 'Just now'
      };
      const updatedComments = [...comments, activityObj];
      setComments(updatedComments);
      localStorage.setItem(`bug_comments_${id}`, JSON.stringify(updatedComments));

      setMessage({ type: 'success', text: 'Bug successfully assigned to you!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to assign bug.' });
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsFixed = async () => {
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.put(`/bugs/${id}/status`, { status: 'FIXED' });
      setBug(response.data.bug);

      // Add activity entry
      const activityObj = {
        id: Date.now(),
        author: user?.name || 'Developer',
        role: 'developer',
        text: `Resolved issue and marked bug status as FIXED.`,
        time: 'Just now'
      };
      const updatedComments = [...comments, activityObj];
      setComments(updatedComments);
      localStorage.setItem(`bug_comments_${id}`, JSON.stringify(updatedComments));

      setMessage({ type: 'success', text: 'Bug successfully marked as FIXED!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update status.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bug details...</p>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="container">
        <Link to="/bugs" className="link-back">
          <ArrowLeft size={16} />
          <span>Back to Bug List</span>
        </Link>
        <div className="empty-state">
          <Bug size={48} className="icon-empty" />
          <h2>Bug Not Found</h2>
          <p>The requested bug does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isUnassigned = !bug.assigned_to;
  const isCanAssign = isUnassigned && user?.role === 'developer';
  const isAssignedToMe = user?.role === 'developer' && bug.assigned_to === user?.id;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bug-details-page container">
      {/* Top Back Navigation */}
      <Link to="/bugs" className="link-back">
        <ArrowLeft size={16} />
        <span>Back to Bug List</span>
      </Link>

      {message.text && (
        <div className={message.type === 'error' ? 'alert-error' : 'alert-success'}>
          <AlertCircle size={18} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Details Panel */}
      <div className="details-card">
        {/* Header */}
        <div className="details-header">
          <div className="title-section">
            <span className="bug-id-tag">Issue Details</span>
            <h1 className="details-title">{bug.title}</h1>
          </div>

          <div className="badge-section">
            <span className={`priority-badge priority-${bug.priority.toLowerCase()}`}>
              {bug.priority} Priority
            </span>
            <span className={`status-badge status-${bug.status.toLowerCase().replace('_', '-')}`}>
              {bug.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="details-grid">
          {/* Main Content Column */}
          <div className="main-content">
            {/* Description */}
            <h3 className="section-title">Description</h3>
            <div className="description-box">
              <p>{bug.description}</p>
            </div>

            {/* Screenshots / Attachments */}
            {(bug.bug_screenshot || bug.bug_video) && (
              <div className="evidence-section" style={{ marginTop: '2rem' }}>
                <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Paperclip size={18} /> Screenshots & Evidence
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {bug.bug_screenshot && (
                    <div className="evidence-card" style={{ background: 'rgba(11, 15, 23, 0.5)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Screenshot Preview
                        </span>
                        <a 
                          href={`http://localhost:5000${bug.bug_screenshot}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-view" 
                          style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          Full Image
                        </a>
                      </div>
                      <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <img 
                          src={`http://localhost:5000${bug.bug_screenshot}`} 
                          alt="Bug Evidence Screenshot" 
                          style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', cursor: 'pointer', display: 'block' }} 
                          onClick={() => window.open(`http://localhost:5000${bug.bug_screenshot}`, '_blank')}
                        />
                      </div>
                    </div>
                  )}

                  {bug.bug_video && (
                    <div className="evidence-card" style={{ background: 'rgba(11, 15, 23, 0.5)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Video Recording
                        </span>
                      </div>
                      <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <video 
                          controls 
                          style={{ width: '100%', maxHeight: '240px', background: '#000', display: 'block' }}
                        >
                          <source src={`http://localhost:5000${bug.bug_video}`} />
                          Your browser does not support HTML5 video player.
                        </video>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Activity & Comments Thread */}
            <div className="comments-section" style={{ marginTop: '2.5rem' }}>
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={18} /> Activity & Comments ({comments.length})
              </h3>

              <div className="comments-thread">
                {comments.map((c) => (
                  <div key={c.id} className="comment-bubble">
                    <div className="comment-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="comment-author">{c.author}</span>
                        {c.role && (
                          <span className={`role-badge role-${c.role}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                            {c.role.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="comment-time">{c.time}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="add-comment-form">
                <input
                  type="text"
                  placeholder="Add a comment or note..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="comment-input"
                />
                <button type="submit" className="btn-primary btn-comment-submit" disabled={!newComment.trim()}>
                  <Send size={16} />
                  <span>Comment</span>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Metadata & Status Actions */}
          <div className="sidebar-meta">
            <h3 className="section-title">Issue Overview</h3>
            
            <div className="meta-card">
              <div className="meta-row">
                <span className="meta-label">
                  <User size={16} className="icon-subtle" /> Reported By
                </span>
                <span className="meta-value">{bug.creator_name || 'Unknown'}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  <User size={16} className="icon-subtle" /> Assigned To
                </span>
                <span className={`meta-value ${isUnassigned ? 'unassigned-text' : ''}`}>
                  {bug.assignee_name || 'Unassigned'}
                </span>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  <Calendar size={16} className="icon-subtle" /> Created Date
                </span>
                <span className="meta-value">{formatDate(bug.created_at)}</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">
                  <Clock size={16} className="icon-subtle" /> Updated Date
                </span>
                <span className="meta-value">{formatDate(bug.updated_at)}</span>
              </div>
            </div>

            {/* Action Box based on role permissions */}
            <div className="action-box">
              {isCanAssign && (
                <button
                  onClick={handleAssignToMe}
                  className="btn-assign-me btn-full"
                  disabled={updating}
                >
                  <UserPlus size={18} />
                  <span>{updating ? 'Assigning...' : 'Assign to Me'}</span>
                </button>
              )}

              {isAssignedToMe && bug.status !== 'FIXED' && (
                <div className="status-update-form">
                  <label htmlFor="status-select">Developer Action:</label>
                  <div className="status-control-group">
                    <button
                      onClick={handleMarkAsFixed}
                      className="btn-primary"
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '100%', justifyContent: 'center' }}
                      disabled={updating}
                    >
                      <CheckCircle2 size={18} />
                      <span>{updating ? 'Updating...' : 'Mark as Fixed'}</span>
                    </button>
                  </div>
                </div>
              )}

              {isAssignedToMe && bug.status === 'FIXED' && (
                <div className="read-only-notice" style={{ color: '#10b981' }}>
                  <CheckCircle2 size={18} />
                  <span style={{ fontWeight: '700' }}>Status: FIXED</span>
                </div>
              )}

              {!isCanAssign && !isAssignedToMe && (
                <div className="read-only-notice">
                  <ShieldAlert size={16} />
                  <span>
                    {isUnassigned
                      ? 'Admin overview only'
                      : `Assigned to ${bug.assignee_name}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugDetails;
