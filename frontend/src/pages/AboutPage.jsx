import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, ShieldCheck, Zap, Eye, CheckCircle, ArrowRight, 
  Users, TestTube, Code, Layers 
} from 'lucide-react';
import GhostTrailHeading from '../components/GhostTrailHeading';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About Us - BugTracker Mission & Values';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="landing-container">
          <div className="hero-badge">
            <Target size={14} className="hero-badge-icon" />
            <span>Our Core Mission</span>
          </div>
          <GhostTrailHeading className="hero-title">
            Empowering Teams to Ship <span className="text-gradient">Flawless Software</span>
          </GhostTrailHeading>
          <p className="hero-subtitle max-w-700">
            BugTracker was created to eliminate the chaos of unorganized bug reports, fragmented feedback, 
            and slow resolution cycles between QA testers and developers.
          </p>
        </div>
      </section>

      {/* Mission & Problem Statement */}
      <section className="section-padding about-mission-section">
        <div className="landing-container">
          <div className="about-grid-2">
            <div className="about-card glass-card">
              <div className="about-icon-box accent-purple">
                <Target size={28} />
              </div>
              <h2 className="about-card-title">Why We Built BugTracker</h2>
              <p className="about-card-text">
                Modern software development moves fast, but quality assurance frequently gets left behind. 
                Traditional issue tracking tools are often overly complex, filled with bloat, or require steep learning curves.
              </p>
              <p className="about-card-text">
                We designed BugTracker as a lean, role-focused platform where Testers can instantly log reproducible bugs, 
                Developers can claim and resolve them without distraction, and Admins maintain full visibility.
              </p>
            </div>

            <div className="about-card glass-card">
              <div className="about-icon-box accent-blue">
                <ShieldCheck size={28} />
              </div>
              <h2 className="about-card-title">The Problem We Solve</h2>
              <p className="about-card-text">
                Without a dedicated role-based system, software teams face:
              </p>
              <ul className="about-check-list">
                <li>
                  <CheckCircle size={18} className="text-green" />
                  <span><strong>Vague Bug Reports:</strong> Lacking exact steps to reproduce or visual attachments.</span>
                </li>
                <li>
                  <CheckCircle size={18} className="text-green" />
                  <span><strong>Unclear Ownership:</strong> Unassigned bugs sitting idle for weeks.</span>
                </li>
                <li>
                  <CheckCircle size={18} className="text-green" />
                  <span><strong>No Audit Trail:</strong> Disorganized status updates and untracked code fixes.</span>
                </li>
                <li>
                  <CheckCircle size={18} className="text-green" />
                  <span><strong>Security Vulnerabilities:</strong> Open access without strict role authorization.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Brief "How It Works" Recap */}
      <section className="section-padding about-recap-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">The Architecture</span>
            <h2 className="section-title">Designed for Role Collaboration</h2>
            <p className="section-description">
              Three synchronized roles working together in real time.
            </p>
          </div>

          <div className="about-roles-grid">
            <div className="about-role-card">
              <div className="role-avatar role-admin-bg">
                <ShieldCheck size={24} className="text-pink" />
              </div>
              <h3>1. Admin Oversight</h3>
              <p>Monitors system metrics, manages team access rights, analyzes velocity reports, and verifies release health.</p>
            </div>

            <div className="about-role-card">
              <div className="role-avatar role-tester-bg">
                <TestTube size={24} className="text-green" />
              </div>
              <h3>2. Tester Precision</h3>
              <p>Logs structured bug reports with step-by-step instructions, severity ratings, and screenshot/video evidence.</p>
            </div>

            <div className="about-role-card">
              <div className="role-avatar role-dev-bg">
                <Code size={24} className="text-blue" />
              </div>
              <h3>3. Developer Resolution</h3>
              <p>Claims bugs from available queues, sets work status to IN_PROGRESS, applies fixes, and updates status to FIXED.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section-padding about-values-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Our Philosophy</span>
            <h2 className="section-title">Core Principles That Drive Us</h2>
            <p className="section-description">
              We guide every feature and workflow by three non-negotiable principles.
            </p>
          </div>

          <div className="values-grid">
            {/* Card 1: Simplicity */}
            <div className="value-card">
              <div className="value-icon-box glow-purple">
                <Layers size={32} />
              </div>
              <h3 className="value-title">1. Simplicity</h3>
              <p className="value-text">
                No complex 50-step setup. Clean interfaces focused purely on reporting, tracking, and fixing bugs without clutter or administrative overhead.
              </p>
            </div>

            {/* Card 2: Speed */}
            <div className="value-card">
              <div className="value-icon-box glow-blue">
                <Zap size={32} />
              </div>
              <h3 className="value-title">2. Speed</h3>
              <p className="value-text">
                Fast page loads, instant real-time status transitions, and quick media evidence uploads mean faster turnaround from bug discovery to resolution.
              </p>
            </div>

            {/* Card 3: Transparency */}
            <div className="value-card">
              <div className="value-icon-box glow-green">
                <Eye size={32} />
              </div>
              <h3 className="value-title">3. Transparency</h3>
              <p className="value-text">
                Complete auditability and role clarity. Everyone on the team knows who reported a bug, who claimed it, and its current status at any second.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="section-padding cta-banner-section">
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Experience Streamlined QA?</h2>
              <p className="cta-text">
                Join Admins, Testers, and Developers already shipping better code with BugTracker.
              </p>
              <div className="cta-buttons">
                <Link to="/login" className="btn-hero-primary">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
