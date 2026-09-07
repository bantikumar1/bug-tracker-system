import React from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main-content">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
