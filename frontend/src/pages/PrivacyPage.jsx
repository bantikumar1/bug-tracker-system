import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - BugTracker';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page section-padding">
      <div className="landing-container max-w-900">
        <div className="section-header text-center">
          <div className="hero-badge">
            <Shield size={14} />
            <span>Legal Documentation</span>
          </div>
          <h1 className="section-title mt-12">Privacy Policy</h1>
          <p className="section-description">
            Last Updated: August 31, 2026. This policy outlines how BugTracker handles information.
          </p>
        </div>

        <div className="glass-card p-32 space-y-24 mt-32 text-secondary">
          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <Lock size={20} className="text-purple" /> 1. Information We Collect
            </h3>
            <p className="line-height-17">
              BugTracker collects standard account details necessary to facilitate role-based bug tracking, 
              including names, professional email addresses, user role designations (Admin, Tester, Developer), 
              and media attachments uploaded alongside bug reports.
            </p>
          </section>

          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <Eye size={20} className="text-blue" /> 2. How Information is Used
            </h3>
            <p className="line-height-17">
              Information collected is exclusively utilized to maintain workspace authentication, 
              manage issue resolution workflows, trigger automated status notifications, and generate internal QA metrics.
            </p>
          </section>

          <section>
            <h3 className="text-white text-xl font-bold mb-12 flex items-center gap-8">
              <FileText size={20} className="text-green" /> 3. Data Protection & Access
            </h3>
            <p className="line-height-17">
              All credentials are cryptographically hashed using salted Bcrypt before database storage. 
              We do not sell, rent, or trade personal data to third parties.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
