import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bug, ArrowLeft, AlertCircle, Image as ImageIcon, Video as VideoIcon, ShieldAlert } from 'lucide-react';

const CreateBug = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (user && user.role === 'developer') {
    return (
      <div className="container" style={{ marginTop: '3rem', maxWidth: '600px' }}>
        <div className="alert-error" style={{ padding: '1.5rem', flexDirection: 'column', gap: '0.75rem', textAlign: 'center', alignItems: 'center' }}>
          <ShieldAlert size={32} />
          <h3 style={{ margin: 0 }}>Access Denied</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Developers are not authorized to create or post bugs. Bug creation is strictly reserved for Testers.</p>
          <Link to="/bugs" className="btn-secondary" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
            Go to Bug List
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both title and description.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('priority', priority);

      if (screenshotFile) {
        formData.append('bug_screenshot', screenshotFile);
      }
      if (videoFile) {
        formData.append('bug_video', videoFile);
      }

      await api.post('/bugs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/bugs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bug.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-bug-page container">
      <Link to="/bugs" className="link-back">
        <ArrowLeft size={16} />
        <span>Back to Bug List</span>
      </Link>

      <div className="form-card">
        <div className="form-header">
          <div className="form-icon">
            <Bug size={24} />
          </div>
          <div>
            <h2>Post a New Bug</h2>
            <p>Submit software defect details and evidence to the tracking system</p>
          </div>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bug-form">
          <div className="form-group">
            <label htmlFor="title">Bug Title *</label>
            <input
              id="title"
              type="text"
              required
              placeholder="e.g. Login button not working"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              required
              rows={5}
              placeholder="Provide clear steps to reproduce, expected vs actual behavior..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority Level *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ImageIcon size={16} className="icon-subtle" /> Screenshot / Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setScreenshotFile(e.target.files[0] || null)}
              className="file-input"
            />
            <small style={{ color: 'var(--text-muted)' }}>Allowed formats: JPG, JPEG, PNG, WEBP</small>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <VideoIcon size={16} className="icon-subtle" /> Bug Recording / Video (Optional)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files[0] || null)}
              className="file-input"
            />
            <small style={{ color: 'var(--text-muted)' }}>Allowed formats: MP4, WEBM, MOV</small>
          </div>

          <div className="form-actions">
            <Link to="/bugs" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Post Bug'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBug;
