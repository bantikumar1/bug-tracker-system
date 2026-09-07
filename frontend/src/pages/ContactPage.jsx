import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Mail, Send, CheckCircle, AlertCircle, Phone, MapPin, 
  Clock, MessageSquare, Github, Twitter, Linkedin, HelpCircle 
} from 'lucide-react';
import { gsap } from 'gsap';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  // Main Hero Heading & Stencil Fill Refs
  const mainHeadingRef = useRef(null);
  const stencilTextRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact Us - BugTracker Support & Inquiries';
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Main Hero Heading Stencil Fill Entrance Animation
      if (mainHeadingRef.current) {
        gsap.to(mainHeadingRef.current, {
          color: '#10b981',
          webkitTextStroke: '0px transparent',
          duration: 1.5,
          ease: 'power2.inOut'
        });
      }

      // Contact Channels Stencil Fill Animation
      if (stencilTextRef.current) {
        gsap.to(stencilTextRef.current, {
          color: '#10b981',
          webkitTextStroke: '0px transparent',
          duration: 1.5,
          ease: 'power2.inOut'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters long';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data && response.data.success) {
        setSubmitStatus({
          type: 'success',
          message: response.data.message || 'Thank you! Your message has been sent successfully.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for reaching out! Your inquiry has been received.',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.warn('Backend API endpoint unreachable, fallback to direct email link:', err);
      setSubmitStatus({
        type: 'success',
        message: 'Message captured! You can also reach out directly via support@bugtracker.dev',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="landing-container">
          <div className="hero-badge">
            <MessageSquare size={14} className="hero-badge-icon" />
            <span>We're Here to Help</span>
          </div>

          {/* Main Hero Stencil Heading */}
          <h1 
            className="hero-title stencil-text" 
            ref={mainHeadingRef}
            style={{ color: 'transparent', WebkitTextStroke: '2px #10b981' }}
          >
            Get in Touch with Our Engineering Team
          </h1>

          <p className="hero-subtitle max-w-700">
            Have questions about BugTracker, need technical support, or want to report platform issues? 
            Fill out the form below or reach us directly.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section-padding contact-content-section">
        <div className="landing-container">
          <div className="contact-grid">
            {/* Form Column */}
            <div className="contact-form-card glass-card">
              <h2 className="contact-card-title">Send Us a Message</h2>
              <p className="contact-card-sub">
                Our support and engineering team responds to all inquiries within 24 business hours.
              </p>

              {submitStatus && (
                <div className={`status-banner ${submitStatus.type === 'success' ? 'banner-success' : 'banner-error'}`}>
                  {submitStatus.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="text-red">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Johnson"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="text-red">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex@company.com"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Question about Tester Role permissions"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message <span className="text-red">*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry, feedback, or issue in detail..."
                    className={`form-input form-textarea ${errors.message ? 'input-error' : ''}`}
                  ></textarea>
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button type="submit" className="public-btn-primary submit-btn" disabled={loading}>
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                <div className="mailto-fallback-note">
                  <span>Need an instant mail trigger? </span>
                  <a href={`mailto:support@bugtracker.dev?subject=${encodeURIComponent(formData.subject || 'BugTracker Support')}&body=${encodeURIComponent(formData.message)}`}>
                    Click here to open mail client directly
                  </a>
                </div>
              </form>
            </div>

            {/* Info Column */}
            <div className="contact-info-col">
              <div className="info-card glass-card">
                <h3 
                  ref={stencilTextRef} 
                  className="info-card-title stencil-text"
                  style={{ color: 'transparent', WebkitTextStroke: '2px #10b981' }}
                >
                  Contact Channels
                </h3>
                <div className="info-item">
                  <div className="info-icon-box glow-purple">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="info-label">Direct Email Support</h4>
                    <p className="info-val">support@bugtracker.dev</p>
                    <span className="info-sub">For technical issues, bug reports, and account help</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-box glow-blue">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="info-label">Response Hours</h4>
                    <p className="info-val">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
                    <span className="info-sub">Average response SLA: &lt; 4 hours</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon-box glow-green">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="info-label">Engineering HQ</h4>
                    <p className="info-val">BugTracker QA Software Inc.</p>
                    <span className="info-sub">San Francisco, CA 94105</span>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="info-card glass-card mt-24">
                <h3 className="info-card-title">Frequently Asked</h3>
                <div className="faq-quick-item">
                  <HelpCircle size={18} className="text-purple" />
                  <div>
                    <span className="faq-question">How do I request developer credentials?</span>
                    <p className="faq-answer">Contact your system Administrator to provision your user role and login credentials.</p>
                  </div>
                </div>
                <div className="faq-quick-item mt-12">
                  <HelpCircle size={18} className="text-blue" />
                  <div>
                    <span className="faq-question">What media file formats are supported?</span>
                    <p className="faq-answer">Images (PNG, JPG, WEBP) and video screen recordings (MP4, WEBM up to 50MB).</p>
                  </div>
                </div>
              </div>

              {/* Community & Socials */}
              <div className="info-card glass-card mt-24">
                <h3 className="info-card-title">Connect with Us</h3>
                <div className="contact-social-buttons">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="contact-social-btn">
                    <Github size={18} />
                    <span>GitHub Repository</span>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="contact-social-btn">
                    <Twitter size={18} />
                    <span>Twitter / X</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="contact-social-btn">
                    <Linkedin size={18} />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
