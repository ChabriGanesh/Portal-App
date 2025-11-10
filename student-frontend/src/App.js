import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import StudentsPage from './StudentsPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import DashboardPage from './DashboardPage';
import UserManual from './UserManual';
import StudentSearchPage from './StudentSearchPage';
const InstituteInfoPage = () => <div style={{ fontSize: 24, textAlign: "center" }}>Institute Information</div>;
const ReportsPage = () => <div style={{ fontSize: 24, textAlign: "center" }}>Reports Content</div>;
function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || null);
  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        {/* Redirect root to login if no token */}
        <Route path="/" element={!token ? <Navigate to="/login" /> : <Navigate to="/home" />} />
        {/* Login page at /login */}
        <Route path="/login" element={!token ? <LoginPage setUser={setUser} /> : <Navigate to="/home" />} />
        {/* Protected home */}
        <Route path="/home" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <HomePage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        {/* Other protected routes */}
        <Route path="/dashboard" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <DashboardPage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/institute-info" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <InstituteInfoPage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/student-information" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <StudentsPage user={user} />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/reports" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <ReportsPage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/student-search" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <StudentSearchPage />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
        <Route path="/user-manual" element={token ? (
          <MainLayout user={{ name: user || 'ADMIN', email: user ? `${user}@email.com` : 'admin@email.com' }}>
            <UserManual />
          </MainLayout>
        ) : (
          <Navigate to="/login" />
        )} />
      </Routes>
    </Router>
  );
}
export default App;