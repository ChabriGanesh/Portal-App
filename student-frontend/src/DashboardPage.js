import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
const API_BASE = process.env.REACT_APP_API_BASE_URL;
function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // Use API_BASE for backend calls
      const resS = await fetch(`${API_BASE}/students`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const studentsData = await resS.json();
      setStudents(Array.isArray(studentsData) ? studentsData : []);

      const resA = await fetch(`${API_BASE}/attendance/all/${today}`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const attData = await resA.json();
      setAttendanceRecords(Array.isArray(attData) ? attData : []);
      setLoading(false);
    }
    fetchAll();
  }, [location, today]);

  const present = students.filter(stu => {
    const record = attendanceRecords.find(r => r.studentId === stu._id);
    return record && record.present;
  }).length;
  const absent = students.length - present;

  const chartData = {
    labels: ['Present', 'Absent'],
    datasets: [{
      data: [present, absent],
      backgroundColor: ['#76db7d', '#f17777']
    }]
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: '#fcfdfe', padding: '50px 0 30px 0'
    }}>
      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 36 }}>
        Dashboard Analytics (All Batches)
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{
          background: '#f5faff', borderRadius: 18, padding: 34, minWidth: 400,
          alignItems: "center", display: "flex", flexDirection: "column", boxShadow: "0 1px 6px #e0edf9"
        }}>
          <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
            Attendance (Present vs Absent)
          </div>
          <Doughnut data={chartData} options={{
            cutout: '70%',
            plugins: {
              legend: {
                display: true, position: "top", align: "center",
                labels: { padding: 22, font: { size: 16 } }
              }
            }
          }} />
          <div style={{ fontWeight: 700, fontSize: 20, marginTop: 32, textAlign: 'center' }}>
            Total students: {students.length}
          </div>
        </div>
      </div>
      {loading && <div style={{ marginTop: 40 }}>Loading data…</div>}
    </div>
  );
}
export default DashboardPage;