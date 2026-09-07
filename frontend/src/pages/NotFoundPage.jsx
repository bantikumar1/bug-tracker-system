import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bug, Home, ArrowLeft, AlertOctagon } from 'lucide-react';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = '404 - Page Not Found | BugTracker';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="not-found-page">
      <div className="landing-container">
        <div className="not-found-card glass-card">
          <div className="not-found-icon-wrapper">
            <AlertOctagon size={48} className="text-red" />
          </div>
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Page Not Found</h2>
          <p className="not-found-text">
            Oops! The page you are looking for doesn't exist, has been moved, or is restricted.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="public-btn-primary">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link to="/login" className="btn-hero-secondary">
              <ArrowLeft size={18} />
              <span>Go to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
