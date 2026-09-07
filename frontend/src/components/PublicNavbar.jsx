import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bug, Menu, X, UserPlus, LogIn } from 'lucide-react';
import { gsap } from 'gsap';

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Animation DOM refs
  const headerRef = useRef(null);
  const brandRef = useRef(null);
  const desktopNavRef = useRef(null);
  const actionBtnRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // GSAP 1: Initial Staggered Entrance Animation & Scroll Listener
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered Entrance Animation on load
      const elementsToAnimate = [
        brandRef.current,
        desktopNavRef.current ? Array.from(desktopNavRef.current.children) : [],
        actionBtnRef.current ? Array.from(actionBtnRef.current.children) : [],
        mobileToggleRef.current
      ].flat().filter(Boolean);

      gsap.fromTo(
        elementsToAnimate,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );

      // Scroll Threshold Animation
      const handleScroll = () => {
        const scrolled = window.scrollY > 40;
        gsap.to(headerRef.current, {
          backgroundColor: scrolled ? 'rgba(11, 15, 23, 0.96)' : 'rgba(11, 15, 23, 0.85)',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 0 0 rgba(0,0,0,0)',
          borderColor: scrolled ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.08)',
          duration: 0.3,
          ease: 'power1.out',
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // GSAP 2: Mobile Drawer Slide & Fade In Animation
  useEffect(() => {
    if (mobileDrawerRef.current) {
      if (mobileMenuOpen) {
        gsap.fromTo(
          mobileDrawerRef.current,
          { opacity: 0, y: -15, height: 0 },
          {
            opacity: 1,
            y: 0,
            height: 'auto',
            duration: 0.35,
            ease: 'power2.out',
          }
        );

        const drawerItems = mobileDrawerRef.current.querySelectorAll('.mobile-nav-link, .mobile-nav-action');
        if (drawerItems.length > 0) {
          gsap.fromTo(
            drawerItems,
            { opacity: 0, x: -15 },
            {
              opacity: 1,
              x: 0,
              duration: 0.25,
              stagger: 0.06,
              delay: 0.1,
              ease: 'power1.out',
            }
          );
        }
      }
    }
  }, [mobileMenuOpen]);

  // GSAP 3: Smooth Hover Animations for Nav Links
  const handleMouseEnter = (e, path) => {
    gsap.to(e.currentTarget, {
      scale: 1.06,
      color: '#ffffff',
      duration: 0.2,
      ease: 'power1.out',
    });
  };

  const handleMouseLeave = (e, path) => {
    gsap.to(e.currentTarget, {
      scale: 1.0,
      color: isActive(path) ? '#ffffff' : '#94a3b8',
      duration: 0.2,
      ease: 'power1.out',
    });
  };

  return (
    <header className="public-navbar" ref={headerRef}>
      <div className="public-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" ref={brandRef} onClick={closeMobileMenu}>
          <div className="brand-logo">
            <Bug size={24} />
          </div>
          <span className="brand-title">BugTracker</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="public-nav-links desktop-only" ref={desktopNavRef}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`public-nav-link ${isActive(link.path) ? 'active' : ''}`}
              onMouseEnter={(e) => handleMouseEnter(e, link.path)}
              onMouseLeave={(e) => handleMouseLeave(e, link.path)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons (Sign In & Sign Up) */}
        <div className="public-nav-actions desktop-only" ref={actionBtnRef}>
          <Link to="/login" className="public-btn-secondary">
            <LogIn size={16} />
            <span>Sign In</span>
          </Link>
          <Link to="/signup" className="public-btn-primary">
            <UserPlus size={16} />
            <span>Sign Up</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-menu-toggle"
          ref={mobileToggleRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer" ref={mobileDrawerRef}>
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-nav-action">
              <div className="mobile-action-buttons">
                <Link
                  to="/login"
                  className="public-btn-secondary full-width mb-8"
                  onClick={closeMobileMenu}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="public-btn-primary full-width"
                  onClick={closeMobileMenu}
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
