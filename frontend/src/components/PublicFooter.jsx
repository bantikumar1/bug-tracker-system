import React from 'react';
import { Link } from 'react-router-dom';
import { Bug, Github, Twitter, Linkedin, Mail, Shield, Code, TestTube } from 'lucide-react';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" className="nav-brand">
              <div className="brand-logo">
                <Bug size={22} />
              </div>
              <span className="brand-title">BugTracker</span>
            </Link>
            <p className="footer-description">
              An enterprise-grade bug tracking and QA management platform. Empowering Admins, 
              Testers, and Developers to collaborate seamlessly and ship bug-free software faster.
            </p>
            <div className="footer-socials">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" title="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="mailto:support@bugtracker.dev" className="social-icon" title="Email Us">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/login">Portal Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Role Workflows */}
          <div className="footer-col">
            <h4 className="footer-col-title">Role Workflows</h4>
            <ul className="footer-links role-links">
              <li>
                <span className="role-dot admin-dot"><Shield size={14} /></span>
                <span>For Admins</span>
              </li>
              <li>
                <span className="role-dot tester-dot"><TestTube size={14} /></span>
                <span>For Testers</span>
              </li>
              <li>
                <span className="role-dot dev-dot"><Code size={14} /></span>
                <span>For Developers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} BugTracker Platform. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/features">Features</Link>
            <span>&bull;</span>
            <Link to="/contact">Contact</Link>
            <span>&bull;</span>
            <Link to="/privacy">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
