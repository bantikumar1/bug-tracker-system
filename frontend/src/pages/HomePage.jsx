import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bug, ShieldCheck, TestTube, Code, CheckCircle, ArrowRight, AlertTriangle, 
  Layers, Lock, Bell, Image, Play, Check, ChevronRight, Zap, RefreshCw, FileText
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');

  // DOM Refs for GSAP ScrollTrigger Animations
  const pageRootRef = useRef(null);
  const heroRef = useRef(null);
  const heroGlowRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtaRef = useRef(null);
  const heroStatsRef = useRef(null);
  const heroWindowRef = useRef(null);

  // Parallax Depth Effect Refs
  const backRef = useRef(null);
  const midRef = useRef(null);
  const frontRef = useRef(null);

  const problemSolutionRef = useRef(null);
  const featuresGridRef = useRef(null);
  const howItWorksRef = useRef(null);
  const demoPreviewRef = useRef(null);
  const ctaBannerRef = useRef(null);

  useEffect(() => {
    document.title = 'BugTracker - Enterprise Bug Tracking & Issue Management';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // 1. HERO SECTION (Page Load Entrance)
      const heroEntranceElements = [
        heroBadgeRef.current,
        midRef.current,
        frontRef.current,
        heroCtaRef.current,
        heroStatsRef.current,
        heroWindowRef.current
      ].filter(Boolean);

      // On load entrance animation
      gsap.fromTo(
        heroEntranceElements,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power2.out'
        }
      );

      // 1B. PARALLAX DEPTH EFFECT (3-Layered Scroll-Driven Depth)
      if (heroRef.current) {
        if (backRef.current) {
          gsap.to(backRef.current, {
            y: -80,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
        if (midRef.current) {
          gsap.to(midRef.current, {
            y: -40,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
        if (frontRef.current) {
          gsap.to(frontRef.current, {
            y: -20,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true
            }
          });
        }
      }

      // Subtle parallax effect on hero background glow
      if (heroGlowRef.current && heroRef.current) {
        gsap.to(heroGlowRef.current, {
          y: 160,
          opacity: 0.25,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // 2. PROBLEM -> SOLUTION SECTION
      if (problemSolutionRef.current) {
        const psCards = problemSolutionRef.current.querySelectorAll('.ps-card');
        gsap.fromTo(
          psCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: problemSolutionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 3. FEATURES GRID
      if (featuresGridRef.current) {
        gsap.from(featuresGridRef.current.querySelectorAll('.feature-card, .card'), {
          x: (i) => (i % 2 === 0 ? -100 : 100),
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuresGridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }

      // 4. HOW IT WORKS SECTION
      if (howItWorksRef.current) {
        const stepCards = howItWorksRef.current.querySelectorAll('.step-card');
        const stepConnectors = howItWorksRef.current.querySelectorAll('.step-connector');

        gsap.fromTo(
          stepCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: howItWorksRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none'
            }
          }
        );

        if (stepConnectors.length > 0) {
          gsap.fromTo(
            stepConnectors,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              stagger: 0.25,
              delay: 0.3,
              ease: 'back.out(1.5)',
              scrollTrigger: {
                trigger: howItWorksRef.current,
                start: 'top 75%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 5. DEMO PREVIEW SECTION
      if (demoPreviewRef.current) {
        const demoDisplay = demoPreviewRef.current.querySelector('.demo-display-box');
        gsap.fromTo(
          demoDisplay,
          { opacity: 0, scale: 0.94, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: demoPreviewRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 6. FINAL CTA BANNER
      if (ctaBannerRef.current) {
        const ctaCard = ctaBannerRef.current.querySelector('.cta-banner-card');
        gsap.fromTo(
          ctaCard,
          { opacity: 0, scale: 0.92, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaBannerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }, pageRootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="home-page" ref={pageRootRef}>
      {/* 1. HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-glow-bg" ref={heroGlowRef}></div>

        {/* 1A. PARALLAX DEPTH LAYER 1: Background Watermark Text */}
        <div className="hero-watermark" ref={backRef}>
          BUGTRACKER QA PLATFORM
        </div>

        <div className="hero-container">
          <div className="hero-badge" ref={heroBadgeRef}>
            <Zap size={14} className="hero-badge-icon" />
            <span>Next-Gen QA & Issue Resolution Platform</span>
          </div>
          
          {/* 1B. PARALLAX DEPTH LAYER 2: Main Heading */}
          <h1 className="hero-title" ref={midRef}>
            Track, Assign, and Resolve Bugs with <span className="text-gradient">Precision & Speed</span>
          </h1>

          {/* 1C. PARALLAX DEPTH LAYER 3: Subtitle Text */}
          <p className="hero-subtitle" ref={frontRef}>
            A unified platform built for Admins, Testers, and Developers to streamline quality assurance, 
            monitor issues in real time, and ship high-quality software without friction.
          </p>

          <div className="hero-cta-group" ref={heroCtaRef}>
            <Link to="/register" className="btn-hero-primary">
              <span>Get Started Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/features" className="btn-hero-secondary">
              <span>Explore Features</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="hero-stats-banner" ref={heroStatsRef}>
            <div className="stat-pill">
              <span className="stat-num">3 Dedicated</span>
              <span className="stat-lbl">Role Workflows</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-pill">
              <span className="stat-num">100% Secure</span>
              <span className="stat-lbl">JWT & RBAC</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-pill">
              <span className="stat-num">Real-Time</span>
              <span className="stat-lbl">Status Updates</span>
            </div>
          </div>

          {/* Interactive CSS Dashboard Preview Mockup */}
          <div className="hero-preview-window" ref={heroWindowRef}>
            <div className="window-header">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="window-title-bar">
                <Bug size={14} />
                <span>app.bugtracker.dev/dashboard</span>
              </div>
              <div className="window-badge">Live System Preview</div>
            </div>

            <div className="window-content">
              {/* Mock Metrics Row */}
              <div className="mock-metrics">
                <div className="mock-card">
                  <span className="mock-label">Total Bugs</span>
                  <span className="mock-value">48</span>
                  <span className="mock-sub text-blue">+12 this week</span>
                </div>
                <div className="mock-card">
                  <span className="mock-label">Open Bugs</span>
                  <span className="mock-value color-open">14</span>
                  <span className="mock-sub text-amber">Requires Triage</span>
                </div>
                <div className="mock-card">
                  <span className="mock-label">In Progress</span>
                  <span className="mock-value color-progress">18</span>
                  <span className="mock-sub text-purple">Assigned to Devs</span>
                </div>
                <div className="mock-card">
                  <span className="mock-label">Fixed & Verified</span>
                  <span className="mock-value color-fixed">16</span>
                  <span className="mock-sub text-green">Ready for Release</span>
                </div>
              </div>

              {/* Mock Bug Table */}
              <div className="mock-table-card">
                <div className="mock-table-header">
                  <span>Recent Bug Reports & Activity</span>
                  <span className="mock-badge-live">
                    <span className="pulse-dot"></span> Live Updates
                  </span>
                </div>
                <div className="mock-row">
                  <div className="mock-cell cell-title">
                    <AlertTriangle size={14} className="icon-high" />
                    <span>Auth Token Expiry crash on refresh</span>
                  </div>
                  <span className="mock-pill role-tester">Tester Sarah</span>
                  <span className="mock-pill status-open">OPEN</span>
                  <span className="mock-pill priority-high">HIGH</span>
                </div>
                <div className="mock-row">
                  <div className="mock-cell cell-title">
                    <RefreshCw size={14} className="icon-medium" />
                    <span>Payment Gateway API timeout on checkout</span>
                  </div>
                  <span className="mock-pill role-developer">Dev Alex</span>
                  <span className="mock-pill status-in-progress">IN_PROGRESS</span>
                  <span className="mock-pill priority-medium">MEDIUM</span>
                </div>
                <div className="mock-row">
                  <div className="mock-cell cell-title">
                    <CheckCircle size={14} className="icon-low" />
                    <span>CSS overflow on mobile navigation drawer</span>
                  </div>
                  <span className="mock-pill role-admin">Admin Marcus</span>
                  <span className="mock-pill status-fixed">FIXED</span>
                  <span className="mock-pill priority-low">LOW</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM -> SOLUTION SECTION */}
      <section className="section-padding problem-solution-section" ref={problemSolutionRef}>
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Why BugTracker?</span>
            <h2 className="section-title">Eliminate QA Bottlenecks & Communication Gaps</h2>
            <p className="section-description">
              Software development fails when bug reports get buried in Slack threads, spreadsheets, or unassigned emails.
            </p>
          </div>

          <div className="ps-grid">
            {/* Problem Card */}
            <div className="ps-card problem-card">
              <div className="ps-card-header">
                <div className="ps-icon-box danger">
                  <AlertTriangle size={24} />
                </div>
                <h3>The Traditional Chaos</h3>
              </div>
              <ul className="ps-list">
                <li>
                  <span className="cross-icon">&#10005;</span>
                  <span>Bugs reported via scattered emails and chat messages with missing context.</span>
                </li>
                <li>
                  <span className="cross-icon">&#10005;</span>
                  <span>Developers unaware of assigned issues or duplicate bug reports.</span>
                </li>
                <li>
                  <span className="cross-icon">&#10005;</span>
                  <span>No screenshot or video attachments attached to reproduce crashes.</span>
                </li>
                <li>
                  <span className="cross-icon">&#10005;</span>
                  <span>Zero oversight for project managers and admins on release readiness.</span>
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="ps-card solution-card">
              <div className="ps-card-header">
                <div className="ps-icon-box success">
                  <CheckCircle size={24} />
                </div>
                <h3>The BugTracker Solution</h3>
              </div>
              <ul className="ps-list">
                <li>
                  <span className="check-icon">&#10003;</span>
                  <span>Structured role-based portals for Testers, Developers, and Admins.</span>
                </li>
                <li>
                  <span className="check-icon">&#10003;</span>
                  <span>Direct claims & assignment with real-time status transitions.</span>
                </li>
                <li>
                  <span className="check-icon">&#10003;</span>
                  <span>Image & video upload support for instant step-by-step reproduction.</span>
                </li>
                <li>
                  <span className="check-icon">&#10003;</span>
                  <span>Centralized dashboard metrics, audit trails, and system notifications.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section className="section-padding features-section" ref={featuresGridRef}>
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Enterprise Features</span>
            <h2 className="section-title">Built for Modern Software Engineering Teams</h2>
            <p className="section-description">
              Everything your team needs to track, debug, and resolve issues systematically.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper role-rbac">
                <ShieldCheck size={28} />
              </div>
              <h3 className="feature-title">Role-Based Access Control</h3>
              <p className="feature-text">
                Dedicated views and authorization rules for ADMIN, TESTER, and DEVELOPER roles ensuring privacy and targeted productivity.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper media-attach">
                <Image size={28} />
              </div>
              <h3 className="feature-title">Screenshot & Video Attachments</h3>
              <p className="feature-text">
                Testers can attach image evidence and video walkthroughs directly to bug reports so developers fix bugs without back-and-forth messaging.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper status-tracking">
                <RefreshCw size={28} />
              </div>
              <h3 className="feature-title">Real-Time Bug Status Tracking</h3>
              <p className="feature-text">
                Track issues through a clean state machine: OPEN &rarr; IN_PROGRESS &rarr; FIXED, with clear severity &amp; priority tags.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper notifications">
                <Bell size={28} />
              </div>
              <h3 className="feature-title">Instant System Notifications</h3>
              <p className="feature-text">
                Keep every team member updated instantly when bugs are assigned, updated, or marked resolved.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper security">
                <Lock size={28} />
              </div>
              <h3 className="feature-title">Secure JWT Authentication</h3>
              <p className="feature-text">
                Protected API endpoints backed by JSON Web Tokens and Bcrypt password hashing for enterprise-grade security.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper reporting">
                <FileText size={28} />
              </div>
              <h3 className="feature-title">System Metrics & Reports</h3>
              <p className="feature-text">
                Comprehensive reporting views for Admins to monitor resolution velocity, bug severity breakdowns, and team workload.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="section-padding how-it-works-section" ref={howItWorksRef}>
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Seamless Workflow</span>
            <h2 className="section-title">How BugTracker Powers Your QA Pipeline</h2>
            <p className="section-description">
              A 3-step structured lifecycle designed to eliminate friction between testing and development.
            </p>
          </div>

          <div className="steps-container">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon-box tester-glow">
                <TestTube size={32} />
              </div>
              <h3 className="step-title">1. Tester Reports Bug</h3>
              <p className="step-desc">
                Testers log detailed bug tickets with steps to reproduce, priority level, environment details, and media attachments.
              </p>
              <div className="step-badge role-tester">TESTER ROLE</div>
            </div>

            <div className="step-connector">
              <ChevronRight size={24} />
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon-box dev-glow">
                <Code size={32} />
              </div>
              <h3 className="step-title">2. Developer Claims & Fixes</h3>
              <p className="step-desc">
                Developers browse open bugs, claim assignments, move status to IN_PROGRESS, apply code fixes, and mark as FIXED.
              </p>
              <div className="step-badge role-developer">DEVELOPER ROLE</div>
            </div>

            <div className="step-connector">
              <ChevronRight size={24} />
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon-box admin-glow">
                <ShieldCheck size={32} />
              </div>
              <h3 className="step-title">3. Admin Monitors & Verifies</h3>
              <p className="step-desc">
                Admins track resolution analytics, assign team members, review progress reports, and verify overall release stability.
              </p>
              <div className="step-badge role-admin">ADMIN ROLE</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SCREENSHOTS / DEMO PREVIEW SECTION */}
      <section className="section-padding demo-preview-section" ref={demoPreviewRef}>
        <div className="landing-container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Interactive Demo Preview</span>
            <h2 className="section-title">Tailored Portals for Every Team Member</h2>
            <p className="section-description">
              Switch between role views below to see how BugTracker adapts to each team member's specific responsibilities.
            </p>
          </div>

          <div className="demo-tab-nav">
            <button
              className={`demo-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <ShieldCheck size={18} />
              <span>Admin Portal</span>
            </button>
            <button
              className={`demo-tab-btn ${activeTab === 'tester' ? 'active' : ''}`}
              onClick={() => setActiveTab('tester')}
            >
              <TestTube size={18} />
              <span>Tester Portal</span>
            </button>
            <button
              className={`demo-tab-btn ${activeTab === 'developer' ? 'active' : ''}`}
              onClick={() => setActiveTab('developer')}
            >
              <Code size={18} />
              <span>Developer Portal</span>
            </button>
          </div>

          <div className="demo-display-box">
            {activeTab === 'admin' && (
              <div className="demo-view-card animate-fade-in">
                <div className="demo-card-header">
                  <div>
                    <h3 className="demo-view-title">Admin Command Center</h3>
                    <p className="demo-view-sub">Complete oversight over users, system metrics, reports, and settings</p>
                  </div>
                  <span className="role-badge role-admin">ADMINISTRATOR</span>
                </div>
                <div className="demo-grid-3">
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Active Testers</span>
                    <span className="demo-stat-val text-green">12 Active</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Active Developers</span>
                    <span className="demo-stat-val text-blue">18 Active</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Resolution Rate</span>
                    <span className="demo-stat-val text-purple">94.2%</span>
                  </div>
                </div>
                <div className="demo-feature-list">
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Manage system user registrations &amp; accounts</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Access global bug distribution &amp; velocity reports</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Configure system settings &amp; global notifications</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tester' && (
              <div className="demo-view-card animate-fade-in">
                <div className="demo-card-header">
                  <div>
                    <h3 className="demo-view-title">Tester Reporting Portal</h3>
                    <p className="demo-view-sub">Fast bug submission with rich evidence attachments &amp; tracking</p>
                  </div>
                  <span className="role-badge role-tester">TESTER</span>
                </div>
                <div className="demo-grid-3">
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Reported Bugs</span>
                    <span className="demo-stat-val text-amber">24 Reported</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Media Attachments</span>
                    <span className="demo-stat-val text-blue">38 Uploaded</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Pending Verification</span>
                    <span className="demo-stat-val text-purple">5 Fixed</span>
                  </div>
                </div>
                <div className="demo-feature-list">
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Form wizard with structured reproduction steps</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Upload screenshots &amp; MP4 video screen recordings</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Track real-time status as developers fix issues</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="demo-view-card animate-fade-in">
                <div className="demo-card-header">
                  <div>
                    <h3 className="demo-view-title">Developer Fix Hub</h3>
                    <p className="demo-view-sub">Claim available bugs, view evidence attachments, and update progress</p>
                  </div>
                  <span className="role-badge role-developer">DEVELOPER</span>
                </div>
                <div className="demo-grid-3">
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Available Pool</span>
                    <span className="demo-stat-val text-amber">8 Unassigned</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">My Claimed Bugs</span>
                    <span className="demo-stat-val text-blue">4 In Progress</span>
                  </div>
                  <div className="demo-stat-box">
                    <span className="demo-stat-title">Fixed This Week</span>
                    <span className="demo-stat-val text-green">14 Resolved</span>
                  </div>
                </div>
                <div className="demo-feature-list">
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Self-assign bugs directly from the available pool</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>Inspect full reproduction steps &amp; media evidence</span>
                  </div>
                  <div className="demo-feature-item">
                    <Check size={16} className="text-green" />
                    <span>One-click status transition to IN_PROGRESS and FIXED</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="section-padding cta-banner-section" ref={ctaBannerRef}>
        <div className="landing-container">
          <div className="cta-banner-card">
            <div className="cta-content">
              <h2 className="cta-title">Start Tracking & Resolving Bugs Today</h2>
              <p className="cta-text">
                Join engineering teams that deliver higher quality releases with BugTracker's role-based workflow.
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn-hero-primary">
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-hero-secondary">
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
