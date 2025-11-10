import React from 'react';
function UserManual() {
  return (
    <div style={{
      maxWidth: 850,
      margin: '50px auto',
      background: '#fff',
      borderRadius: 16,
      padding: '36px 32px',
      boxShadow: '0 4px 24px #dde6f3',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 18, fontWeight: 700, fontSize: 28 }}>
        User Manual
      </h1>
      <ol style={{ fontSize: 17, color: '#254', marginBottom: 24, marginLeft: 12, lineHeight: 1.7 }}>
        <li>Login using your registered email and password.</li>
        <li>Navigate through the sidebar to view Home, Dashboard, Student Information, and more.</li>
        <li>View and manage student records, mark attendance, and export data as needed.</li>
        <li>Use the “Add Student” form to add new student data.</li>
        <li>For account settings, use the top-right user dropdown.</li>
        <li>If you face any issues, contact your administrator for help.</li>
      </ol>
      <div style={{ fontSize: 16, marginTop: 10, color: '#337', textAlign: 'center' }}>
        For further queries, refer to the FAQ section in the sidebar.
      </div>
    </div>
  );
}
export default UserManual;
