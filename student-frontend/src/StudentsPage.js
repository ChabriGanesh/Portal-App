import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './StudentsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const batchOptions = ['Batch A', 'Batch B', 'Batch C'];

function StudentsPage({ user }) {
  const [students, setStudents] = useState([]);
  const [uploadedPhotoFilename, setUploadedPhotoFilename] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [batch, setBatch] = useState(batchOptions[0]);
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [form, setForm] = useState({
    name: '', rollNo: '', email: '', phone: '', present: true
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', rollNo: '', email: '', phone: '', present: true
  });

  useEffect(() => {
    fetch(`${API_BASE}/students`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => setStudents(Array.isArray(data) ? data : []))
      .catch(() => setStudents([]));
  }, [refresh, batch]);

  useEffect(() => {
    const ymd = attendanceDate.toISOString().slice(0, 10);
    fetch(`${API_BASE}/attendance/batch/${batch}/${ymd}`, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(res => res.json())
      .then(data => setAttendanceRecords(Array.isArray(data) ? data : []))
      .catch(() => setAttendanceRecords([]));
  }, [refresh, batch, attendanceDate]);

  const displayStudents = (Array.isArray(students) ? students : []).filter(
    s => s.batch === batch
  );

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBatchChange = e => setBatch(e.target.value);

  const handlePhotoUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const res = await fetch(`${API_BASE}/upload-photo-temp`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      setUploadedPhotoFilename(data.filename);
    } catch (err) {
      console.error('Photo upload failed', err);
    }
  };

  const addStudent = async e => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ ...form, batch, photoFilename: uploadedPhotoFilename }),
      });
      setForm({ name: '', rollNo: '', email: '', phone: '', present: true });
      setUploadedPhotoFilename(null);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error('Add student failed', err);
    }
  };

  const deleteStudent = async id => {
    try {
      await fetch(`${API_BASE}/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      setRefresh(r => r + 1);
    } catch (err) {
      console.error('Delete student failed', err);
    }
  };

  const startEdit = student => {
    setEditingId(student._id);
    setEditForm({ ...student });
  };

  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const saveEdit = async id => {
    try {
      await fetch(`${API_BASE}/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      setRefresh(r => r + 1);
    } catch (err) {
      console.error('Save edit failed', err);
    }
  };

  const markAttendance = async (studentId, isPresent) => {
    try {
      await fetch(`${API_BASE}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          studentId,
          date: attendanceDate.toISOString().slice(0, 10),
          present: isPresent
        }),
      });
      setRefresh(r => r + 1);
    } catch (err) {
      console.error('Mark attendance failed', err);
    }
  };

  const attendanceSummary = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        label: 'Attendance',
        data: [
          attendanceRecords.filter(r => r.present).length,
          attendanceRecords.filter(r => !r.present).length,
        ],
        backgroundColor: ['#57d05b', '#e44545'],
      },
    ],
  };

  return (
    <div className="students-container" style={{ maxWidth: 1200, margin: 'auto', padding: 16 }}>
      {/* Styled Prompt Form */}
      <div style={{ maxWidth: 480, margin: "32px auto", borderRadius: 8, boxShadow: "0 1px 6px #d0dcfa", border: "1px solid #aac4e6" }}>
        <div style={{
          background: "#337ab7",
          color: "#fff",
          fontWeight: 600,
          textAlign: "center",
          fontSize: 22,
          padding: "14px 0",
          borderTopLeftRadius: 7,
          borderTopRightRadius: 7
        }}>
          Student Portal
        </div>
        <form
          onSubmit={addStudent}
          style={{
            background: "#fafdff",
            borderRadius: "0 0 7px 7px",
            padding: "22px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <label style={{ color: "#127", fontSize: 15 }}>Date</label>
          <input
            type="date"
            value={attendanceDate.toISOString().slice(0, 10)}
            onChange={e => setAttendanceDate(new Date(e.target.value))}
            style={{ padding: '10px 14px', border: '1px solid #dee9fa', borderRadius: 6, fontSize: 16 }}
            required
          />
          <label style={{ color: "#127", fontSize: 15 }}>Batch</label>
          <select
            value={batch}
            onChange={handleBatchChange}
            style={{ padding: '10px 14px', border: '1px solid #dee9fa', borderRadius: 6, fontSize: 16 }}
          >
            {batchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <label style={{ color: "#127", fontSize: 15 }}>Name</label>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#f2f7ff", border: "1px solid #bed6ed", borderRadius: 6
          }}>
            <span style={{ padding: '0 12px', color: "#4a87c7", fontSize: 18 }}>👤</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              style={{ border: "none", outline: "none", background: "none", padding: "12px 8px", fontSize: 17, width: "100%" }}
              required
            />
          </div>
          <label style={{ color: "#127", fontSize: 15 }}>Roll No</label>
          <input
            name="rollNo"
            value={form.rollNo}
            onChange={handleChange}
            placeholder="Roll No"
            style={{ padding: '10px 14px', border: '1px solid #dee9fa', borderRadius: 6, fontSize: 16 }}
            required
          />
          <label style={{ color: "#127", fontSize: 15 }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={{ padding: '10px 14px', border: '1px solid #dee9fa', borderRadius: 6, fontSize: 16 }}
            required
          />
          <label style={{ color: "#127", fontSize: 15 }}>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            style={{ padding: '10px 14px', border: '1px solid #dee9fa', borderRadius: 6, fontSize: 16 }}
            required
          />
          <input type="file" accept="image/*" onChange={handlePhotoUpload} />
          {uploadedPhotoFilename && <span style={{ color: "#1877b8", fontSize: 15 }}>Photo Uploaded!</span>}
          <button type="submit" style={{
            width: "100%", marginTop: 6,
            padding: "10px 0", fontWeight: 700,
            background: "#337ab7", color: "#fff", border: "none", borderRadius: 6, fontSize: 17
          }} disabled={!uploadedPhotoFilename}>Add Student</button>
        </form>
      </div>

      {/* Attendance Chart */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <div style={{ maxWidth: 400 }}>
          <Bar data={attendanceSummary} />
        </div>
      </div>

      {/* Students Table */}
      <h2 style={{ marginTop: 28, marginBottom: 8, textAlign: "center" }}>Student List ({batch})</h2>
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <CSVLink data={attendanceRecords} filename={"attendance.csv"} style={{ marginRight: 20 }}>Export Attendance</CSVLink>
        <CSVLink data={displayStudents} filename={"students.csv"}>Export Students</CSVLink>
      </div>
      <table
        className="student-table"
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          background: "#eaf3fc",
          borderRadius: 12,
          boxShadow: "0 1px 6px #bfd7f1",
          overflow: "hidden"
        }}
      >
        <thead>
          <tr style={{
            background: "#337ab7",
            color: "#222",
            fontWeight: 600,
            fontSize: 17,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}>
            <th style={{ padding: "12px 8px" }}>Name</th>
            <th>Roll No</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Photo</th>
            <th>Attendance</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {displayStudents.map((s, i) =>
            editingId === s._id ? (
              <tr key={s._id}
                style={{
                  background: i % 2 === 0 ? "#d4e7fc" : "#fff",
                  fontWeight: 500
                }}>
                <td><input name="name" value={editForm.name || ''} onChange={handleEditChange} /></td>
                <td><input name="rollNo" value={editForm.rollNo || ''} onChange={handleEditChange} /></td>
                <td><input name="email" value={editForm.email || ''} onChange={handleEditChange} /></td>
                <td><input name="phone" value={editForm.phone || ''} onChange={handleEditChange} /></td>
                <td></td>
                <td>
                  <button onClick={() => saveEdit(s._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={s._id}
                style={{
                  background: i % 2 === 0 ? "#d4e7fc" : "#fff"
                }}>
                <td>{s.name}</td>
                <td>{s.rollNo}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>
                  {s.photoFilename ? (
                    <img
                      src={`${API_BASE}/uploads/${s.photoFilename}`}
                      alt={s.name}
                      style={{ width: "48px", height: "48px", borderRadius: "50%" }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td>
                  {(() => {
                    const record = attendanceRecords.find(r => r.studentId === s._id);
                    if (record) {
                      return (
                        <button
                          style={{
                            background: record.present ? '#57d05b' : '#e44545',
                            color: '#fff',
                            border: 'none',
                            padding: '5px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                          onClick={() => markAttendance(s._id, !record.present)}
                        >
                          {record.present ? "Present" : "Absent"}
                        </button>
                      );
                    } else {
                      return (
                        <>
                          <button
                            style={{
                              background: '#57d05b',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              marginRight: '4px'
                            }}
                            onClick={() => markAttendance(s._id, true)}
                          >Present</button>
                          <button
                            style={{
                              background: '#e44545',
                              color: '#fff',
                              border: 'none',
                              padding: '5px 14px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => markAttendance(s._id, false)}
                          >Absent</button>
                        </>
                      );
                    }
                  })()}
                </td>
                <td>
                  <button onClick={() => startEdit(s)}>Edit</button>
                  <button onClick={() => deleteStudent(s._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsPage;