import React from 'react';
import bgImage from './image.jpg';
function HomePage() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '90vh',
        width: '100%',
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.80)',
          borderRadius: 18,
          margin: '58px 5vw',
          maxWidth: 900,
          padding: '38px 44px 32px 48px',
          boxShadow: '0 4px 32px #dae8f9',
          position: 'relative',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 18, fontWeight: 700, fontSize: 30 }}>
          Welcome to Your Student Portal
        </h1>

        <p style={{ fontSize: 18, color: '#244', marginBottom: 30, textAlign: 'center' }}>
          This platform is designed to simplify and centralize student management for your organization.
          Manage student data, attendance, approvals, and more—all in one place.
        </p>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Key Benefits</h2>
        <ul style={{ fontSize: 17, color: '#2a3b4c', marginBottom: 18, marginLeft: 24, lineHeight: 1.6 }}>
          <li>Effortlessly track student attendance and academic status</li>
          <li>Export data and reports for efficient administration</li>
          <li>Streamlined user roles and secure access for admins and staff</li>
          <li>Comprehensive dashboard for quick insights</li>
          <li>Integrated approval and status update workflows</li>
        </ul>

        <p style={{ fontSize: 17, marginTop: 30, textAlign: 'center', color: '#337'}}>
          Get started by using the sidebar to explore Dashboard, Student Information, Reports, and more.
        </p>
        <p style={{ fontSize: 17, marginTop: 8, textAlign: 'center', color: '#337'}}>
          If you need help, check the User Manual or contact your administrator.
        </p>
      </div>
    </div>
  );
}
export default HomePage;