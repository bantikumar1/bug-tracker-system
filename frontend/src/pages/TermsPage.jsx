import React, { useEffect } from 'react';
import { FileText, CheckCircle, AlertOctagon, Scale } from 'lucide-react';

const TermsPage = () => {
  useEffect(() => {
    document.title = 'Terms of Service - BugTracker';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page section-padding">
      <div className="landing-container max-w-900">
        <div className="section-header text-center">
          <div className="hero-badge">
            <Scale size={14} />
            <span>Legal Terms</span>
          </div>
          <h1 className="section-title mt-12">Terms of Service</h1>
          <p className="section-description">
            Last Updated: August 31, 2026. Terms governing the use of the BugTracker platform.
          </p>
        </div>

        <div className="glass-card p-32 space-y-24 mt-32 text-secondary">
          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <FileText size={20} className="text-purple" /> 1. Platform Usage & Acceptance
            </h3>
            <p className="line-height-17">
              By accessing or registering an account on BugTracker, you agree to comply with these terms, 
              maintaining professional use of the issue tracking system and adhering to your assigned workspace permissions.
            </p>
          </section>

          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <CheckCircle size={20} className="text-green" /> 2. User Responsibilities
            </h3>
            <p className="line-height-17">
              Users are responsible for maintaining account confidentiality and ensuring all reported bug evidence, 
              code snippets, and comments adhere to organization guidelines and security standards.
            </p>
          </section>

          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <AlertOctagon size={20} className="text-amber" /> 3. Service SLA & Modifications
            </h3>
            <p className="line-height-17">
              BugTracker reserves the right to modify platform capabilities, apply maintenance updates, and update 
              service availability to maintain infrastructure integrity and feature performance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
