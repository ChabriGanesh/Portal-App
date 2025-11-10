import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import adminIcon from './icon.jpg'; 
const sidebarItems = [
  { icon: '🏠', label: 'Home', to: '/home' },
  { icon: '📊', label: 'Dashboard', to: '/dashboard' },
  { icon: '🏢', label: 'Institute Information', to: '/institute-info' },
  { icon: '🎓', label: 'Student Information', to: '/student-information' },
  { icon: '📋', label: 'Reports', to: '/reports' },
  { icon: '🔍', label: 'Student Search', to: '/student-search' },
  { icon: '📘', label: 'User Manual', to: '/user-manual' }
];
function MainLayout({ user, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/'; 
  };
  const handleChangePassword = () => {
    navigate('/change-password');
  };
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fafbfc' }}>
      {/* Sidebar */}
      <aside style={{ width: 230, background: '#fff', borderRight: '1px solid #e4e8ef', padding: '22px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {sidebarItems.map(item => (
            <li key={item.label}
                style={{
                  padding: '13px 32px',
                  fontWeight: location.pathname === item.to ? 700 : 500,
                  background: location.pathname === item.to ? '#e7f3ff' : undefined,
                  color: location.pathname === item.to ? '#1967c7' : '#222',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 15,
                  cursor: 'pointer'
                }}>
              <Link to={item.to} style={{
                textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 15, width: '100%'
              }}>
                <span>{item.icon}</span> {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main area */}
      <div style={{ flex: 1 }}>
        {/* Top bar */}
        <header style={{
          padding: 22, background: '#fff', borderBottom: '1px solid #e4e8ef',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end'
        }}>
          {/* User Avatar Dropdown Only */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '11px',
                background: '#f7fbff', borderRadius: '22px', padding: '4px 14px',
                fontWeight: 600, fontSize: 15, boxShadow: '0 1px 8px rgba(30,80,180,0.06)', cursor: 'pointer'
              }}
            >
              <img
                src={adminIcon}
                alt="User"
                style={{ width: 34, height: 34, borderRadius: "50%", background: "#d3def5", objectFit: 'cover' }}
              />
              <span style={{ color: "#0537a8", fontWeight: 700 }}>{user?.name || 'ADMIN'}</span>
              <span style={{ fontSize: 16, color: '#333', marginLeft: 2 }}>▼</span>
            </div>
            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: '48px', right: 0,
                background: '#fff', borderRadius: '17px', padding: '24px',
                boxShadow: '0 4px 16px #c1d5ee', minWidth: '274px', textAlign: 'center', zIndex: 99
              }}>
                <img src={adminIcon} alt="User" style={{ width: 60, borderRadius: '50%', marginBottom: 10 }} />
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 2, marginTop: 5 }}>
                  {user?.email || 'admin@example.com'}
                </div>
                <div style={{ borderTop: '1px solid #eee', margin: '12px 0' }}></div>
                <div
                  style={{ fontSize: 16, color: '#1872d2', cursor: 'pointer', margin: '9px 0' }}
                  onClick={handleChangePassword}
                >Change Password</div>
                <div
                  style={{ fontSize: 16, color: '#e23f3f', cursor: 'pointer', margin: '9px 0' }}
                  onClick={handleLogout}
                >Logout</div>
              </div>
            )}
          </div>
        </header>
        {/* Page content */}
        <section style={{ padding: '28px 42px' }}>
          {children}
        </section>
      </div>
    </div>
  );
}
export default MainLayout;