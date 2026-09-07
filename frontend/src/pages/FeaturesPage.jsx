import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, TestTube, Code, RefreshCw, Lock, Image, Video, 
  CheckCircle, ArrowRight, Key, Shield, Layers, FileCheck, Zap
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesPage = () => {
  const headingRef = useRef(null);
  const cardsSectionRef = useRef(null);

  useEffect(() => {
    document.title = 'Features - BugTracker Role Breakdown & Security';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const tl = gsap.timeline();

        // Step 1: Cinema Title Entrance (0.35em -> normal spacing over 1.6s with power3.inOut ease)
        tl.fromTo(
          headingRef.current,
          { letterSpacing: '0.35em', opacity: 0 },
          { letterSpacing: 'normal', opacity: 1, duration: 1.6, ease: 'power3.inOut' }
        );

        // Step 2: Sequenced Matrix Rain Character Scatter Drop
        const chars = headingRef.current.querySelectorAll('.matrix-char');
        if (chars.length > 0) {
          tl.fromTo(
            chars,
            { y: -50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: { each: 0.03, from: 'random' },
              duration: 0.5,
              ease: 'power2.out'
            },
            "-=0.6" // Overlap for fluid motion
          );
        }
      }

      // Card Section GSAP Animation: Alternating x offset (-100 / 100), opacity 0, duration 0.6, stagger 0.15, power3.out
      if (cardsSectionRef.current) {
        gsap.from(cardsSectionRef.current.querySelectorAll('.card'), {
          x: (i) => i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const headingText = "Engineered for Precision Across Every Role";

  return (
    <div className="features-page">
      {/* Hero Section */}
      <section className="features-hero-section">
        <div className="landing-container">
          <div className="hero-badge">
            <Layers size={14} className="hero-badge-icon" />
            <span>Comprehensive Capability Breakdown</span>
          </div>
          
          {/* Cinema Title + Matrix Rain Animated Heading */}
          <h1 className="hero-title" ref={headingRef} style={{ letterSpacing: 'normal' }}>
            {headingText.split('').map((char, index) => (
              <span key={index} className="matrix-char" style={{ display: 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <p className="hero-subtitle max-w-700">
            Explore the specialized toolsets built for Administrators, Quality Assurance Testers, 
            and Software Developers to manage software quality end-to-end.
          </p>
        </div>
      </section>

      {/* Role-Based Breakdown Section */}
      <section className="section-padding role-features-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Tailored Architecture</span>
            <h2 className="section-title">Specialized Workflows for Every Role</h2>
            <p className="section-description">
              BugTracker adapts its interfaces and permissions dynamically depending on whether you log in 
              as an Admin, Tester, or Developer.
            </p>
          </div>

          <div className="role-features-grid">
            {/* 1. Admin Workflow */}
            <div className="role-feature-card glass-card border-purple">
              <div className="role-card-header">
                <div className="role-icon-badge glow-purple">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h3 className="role-title">Administrator Portal</h3>
                  <span className="role-badge role-admin">ADMIN ROLE</span>
                </div>
              </div>
              <p className="role-desc">
                Complete system oversight with user management, system-wide analytics, report generation, and security configuration.
              </p>
              <ul className="role-bullets">
                <li><CheckCircle size={16} className="text-purple" /> Provision &amp; manage Tester &amp; Developer accounts</li>
                <li><CheckCircle size={16} className="text-purple" /> Access resolution velocity &amp; distribution reports</li>
                <li><CheckCircle size={16} className="text-purple" /> Toggle account active status &amp; reset credentials</li>
                <li><CheckCircle size={16} className="text-purple" /> Configure global notification triggers &amp; theme defaults</li>
              </ul>
            </div>

            {/* 2. Tester Workflow */}
            <div className="role-feature-card glass-card border-green">
              <div className="role-card-header">
                <div className="role-icon-badge glow-green">
                  <TestTube size={28} />
                </div>
                <div>
                  <h3 className="role-title">Tester Portal</h3>
                  <span className="role-badge role-tester">TESTER ROLE</span>
                </div>
              </div>
              <p className="role-desc">
                Streamlined bug logging interface optimized for rapid issue creation, evidence upload, and resolution verification.
              </p>
              <ul className="role-bullets">
                <li><CheckCircle size={16} className="text-green" /> Multi-step bug creation wizard with priority tags</li>
                <li><CheckCircle size={16} className="text-green" /> Upload screenshots &amp; video recordings (up to 50MB)</li>
                <li><CheckCircle size={16} className="text-green" /> Track personal bug submission history &amp; status updates</li>
                <li><CheckCircle size={16} className="text-green" /> Verify FIXED tickets and close resolved issues</li>
              </ul>
            </div>

            {/* 3. Developer Workflow */}
            <div className="role-feature-card glass-card border-blue">
              <div className="role-card-header">
                <div className="role-icon-badge glow-blue">
                  <Code size={28} />
                </div>
                <div>
                  <h3 className="role-title">Developer Portal</h3>
                  <span className="role-badge role-developer">DEVELOPER ROLE</span>
                </div>
              </div>
              <p className="role-desc">
                Focus-driven issue workbench designed for claiming open tickets, reviewing reproduction steps, and applying fixes.
              </p>
              <ul className="role-bullets">
                <li><CheckCircle size={16} className="text-blue" /> Browse open unassigned bug pool &amp; claim assignments</li>
                <li><CheckCircle size={16} className="text-blue" /> Update bug status from OPEN &rarr; IN_PROGRESS &rarr; FIXED</li>
                <li><CheckCircle size={16} className="text-blue" /> Inspect line-of-code locations &amp; attached media proof</li>
                <li><CheckCircle size={16} className="text-blue" /> Personal metrics dashboard tracking resolution efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive GSAP Card Showcase Section */}
      <section className="section-padding card-section" ref={cardsSectionRef}>
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Platform Highlights</span>
            <h2 className="section-title">Engineered Capabilities at a Glance</h2>
            <p className="section-description">
              A comprehensive toolkit for QA engineering, bug resolution, and security management.
            </p>
          </div>

          <div className="cards-grid">
            <div className="card glass-card border-purple">
              <div className="card-icon-box glow-purple">
                <ShieldCheck size={28} />
              </div>
              <h3 className="card-title">Role-Based Portals</h3>
              <p className="card-desc">
                Dedicated interfaces for Admins, Testers, and Developers with strict permission boundaries and targeted tools.
              </p>
            </div>

            <div className="card glass-card border-blue">
              <div className="card-icon-box glow-blue">
                <Video size={28} />
              </div>
              <h3 className="card-title">Media Proof Attachments</h3>
              <p className="card-desc">
                Attach high-resolution screenshots and video screen recordings directly to tickets so developers reproduce bugs instantly.
              </p>
            </div>

            <div className="card glass-card border-green">
              <div className="card-icon-box glow-green">
                <Lock size={28} />
              </div>
              <h3 className="card-title">OTP 2FA &amp; Security</h3>
              <p className="card-desc">
                Multi-factor login verification via 6-digit OTP codes, rate-limited attempts, and Bcrypt password hashing.
              </p>
            </div>

            <div className="card glass-card border-amber">
              <div className="card-icon-box glow-amber">
                <RefreshCw size={28} />
              </div>
              <h3 className="card-title">Real-Time Bug Triage</h3>
              <p className="card-desc">
                Track issues through a clean state machine (OPEN &rarr; IN_PROGRESS &rarr; FIXED) with real-time audit logs and alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="section-padding feature-deep-dive">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Platform Capabilities</span>
            <h2 className="section-title">Core Engine Features</h2>
            <p className="section-description">
              Built from the ground up for high-throughput QA teams.
            </p>
          </div>

          <div className="deep-dive-grid">
            <div className="deep-card">
              <div className="deep-icon glow-amber"><RefreshCw size={24} /></div>
              <h4>Real-Time Status Synchronization</h4>
              <p>Instant status updates across OPEN, IN_PROGRESS, and FIXED states without page reloads.</p>
            </div>
            <div className="deep-card">
              <div className="deep-icon glow-purple"><Image size={24} /></div>
              <h4>Proof Screenshot Uploads</h4>
              <p>Attach crisp PNG, JPG, and WEBP evidence to prove reproduction steps unambiguously.</p>
            </div>
            <div className="deep-card">
              <div className="deep-icon glow-blue"><Video size={24} /></div>
              <h4>Screen Recording Attachments</h4>
              <p>Upload video recordings demonstrating complex multi-step UI bugs and crashes.</p>
            </div>
            <div className="deep-card">
              <div className="deep-icon glow-green"><Key size={24} /></div>
              <h4>Granular RBAC Protection</h4>
              <p>Strict server-side permission middleware protecting every single API route.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Evidence Highlight Section */}
      <section className="section-padding media-highlight-section">
        <div className="landing-container">
          <div className="media-highlight-grid">
            <div className="media-text-content">
              <span className="section-eyebrow">Evidence Support</span>
              <h2 className="section-title">No More Unreproducible Bug Reports</h2>
              <p className="section-description">
                Equip your QA team with full media attachment capabilities. Testers upload screenshots 
                and screen recordings directly when logging a ticket.
              </p>
              <div className="attachment-features">
                <div className="att-feature-item">
                  <Image size={20} className="text-blue" />
                  <span>High-resolution screenshot uploads (PNG, JPG, WEBP)</span>
                </div>
                <div className="att-feature-item">
                  <Video size={20} className="text-purple" />
                  <span>Screen video recordings demonstrating precise crash reproduction steps</span>
                </div>
                <div className="att-feature-item">
                  <FileCheck size={20} className="text-green" />
                  <span>Hosted media static server with secure relative asset resolution</span>
                </div>
              </div>
            </div>
            <div className="attachment-visual">
              <div className="mock-attachment-card">
                <div className="mock-att-header">
                  <Video size={18} className="text-purple" />
                  <span>Bug_Crash_Proof_042.mp4</span>
                  <span className="mock-att-size">4.2 MB</span>
                </div>
                <div className="mock-att-preview">
                  <div className="play-button-overlay">
                    <Video size={36} className="text-white" />
                  </div>
                  <span className="preview-label">Click to Play Media Attachment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Highlights Section */}
      <section className="section-padding security-section">
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Enterprise Trust</span>
            <h2 className="section-title">Built-In Security &amp; Role Authorization</h2>
            <p className="section-description">
              Protect your bug reports, application data, and user accounts with robust security layers.
            </p>
          </div>

          <div className="security-grid">
            <div className="security-card">
              <div className="security-icon-box glow-purple">
                <Key size={32} />
              </div>
              <h3>JWT Token Authentication</h3>
              <p>Every API request is verified using cryptographically signed JSON Web Tokens (JWT) stored in secure client headers.</p>
            </div>

            <div className="security-card">
              <div className="security-icon-box glow-blue">
                <Lock size={32} />
              </div>
              <h3>Bcrypt Password Hashing</h3>
              <p>User credentials are encrypted using industry-standard Bcrypt salted password hashes prior to database storage.</p>
            </div>

            <div className="security-card">
              <div className="security-icon-box glow-green">
                <Shield size={32} />
              </div>
              <h3>Server-Side RBAC Middleware</h3>
              <p>Express authorization middleware enforces role permission checks on every restricted endpoint (ADMIN, TESTER, DEVELOPER).</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding cta-banner-section">
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Upgrade Your QA Pipeline?</h2>
              <p className="cta-text">
                Login now to start reporting and resolving software issues seamlessly.
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

export default FeaturesPage;
